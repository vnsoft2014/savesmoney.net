import { compare } from 'bcryptjs';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

import connectDB from '@/lib/db/connectDB';
import User from '@/models/User';

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
}).unknown(true);

export async function GET(req: Request) {
    return NextResponse.redirect(new URL('/login', req.url));
}

export async function OPTIONS() {
    return NextResponse.json(
        {},
        {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        },
    );
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { error, value } = schema.validate(body);

        if (error) {
            return NextResponse.json({ message: error.details[0].message.replace(/['"]+/g, '') }, { status: 400 });
        }

        const { email, password } = value;

        const user = await User.findOne({ email }).lean();
        if (!user) {
            return NextResponse.json({ message: 'Invalid login credentials.' }, { status: 401 });
        }

        if (user.isBlocked) {
            return NextResponse.json(
                {
                    message: user.blockReason
                        ? `Account blocked: ${user.blockReason}`
                        : 'Your account has been blocked.',
                },
                { status: 403 },
            );
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid login credentials.' }, { status: 401 });
        }

        const expiresIn = 60 * 60 * 24 * 30; // 30 days for external apps

        const accessToken = jwt.sign(
            {
                sub: user._id.toString(),
                role: user.role,
            },
            process.env.NEXTAUTH_SECRET!,
            { expiresIn },
        );

        const response = NextResponse.json({
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
            role: user.role,
            avatar: user.avatar,
            accessToken,
            expiresAt: Date.now() + expiresIn * 1000,
        });

        // Add CORS headers for extension
        response.headers.set('Access-Control-Allow-Origin', '*');

        return response;
    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
