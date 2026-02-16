import { compare, hash } from 'bcryptjs';
import crypto from 'crypto';

import Joi from 'joi';
import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';
import AppleProvider from 'next-auth/providers/apple';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import connectDB from '@/DB/connectDB';
import User from '@/models/User';

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    rememberMe: Joi.boolean().optional(),
}).unknown(true);

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        AppleProvider({
            clientId: process.env.APPLE_ID!,
            clientSecret: process.env.APPLE_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                rememberMe: { label: 'Remember me', type: 'text' },
            },

            async authorize(credentials) {
                try {
                    await connectDB();

                    const { error, value } = schema.validate(credentials);

                    if (error) {
                        throw new Error(error.details[0].message.replace(/['"]+/g, ''));
                    }

                    const { email, password, rememberMe } = value;

                    const user = await User.findOne({ email }).lean();
                    if (!user) {
                        throw new Error('Invalid login credentials.');
                    }

                    if (user.isBlocked) {
                        throw new Error(
                            user.blockReason
                                ? `Account blocked: ${user.blockReason}`
                                : 'Your account has been blocked.',
                        );
                    }

                    const isMatch = await compare(password, user.password);
                    if (!isMatch) {
                        throw new Error('Invalid login credentials.');
                    }

                    const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 6; // seconds

                    const accessToken = jwt.sign(
                        {
                            sub: user._id.toString(),
                            role: user.role,
                        },
                        process.env.NEXTAUTH_SECRET!,
                        { expiresIn },
                    );

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name || user.email,
                        role: user.role,
                        avatar: user.avatar,
                        accessToken,
                        accessTokenExpires: Date.now() + expiresIn * 1000,
                    };
                } catch (err: any) {
                    throw new Error(err.message || 'Login failed');
                }
            },
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24, // 1 day
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (!account || account.provider === 'credentials') {
                return true;
            }

            await connectDB();

            const email = user.email;
            if (!email) {
                return false;
            }

            let existingUser = await User.findOne({ email });

            if (existingUser?.isBlocked) {
                throw new Error(
                    existingUser.blockReason
                        ? `Account blocked: ${existingUser.blockReason}`
                        : 'Your account has been blocked.',
                );
            }

            if (!existingUser) {
                const randomPassword = crypto.randomBytes(32).toString('hex');

                // hash password
                const hashedPassword = await hash(randomPassword, 10);

                existingUser = await User.create({
                    email,
                    name: user.name || profile?.name || email,
                    avatar: user.image || null,
                    role: 'user',
                    isBlocked: false,
                    password: hashedPassword,
                });
            }

            user.id = existingUser._id.toString();
            user.role = existingUser.role;
            user.avatar = existingUser.avatar;

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || 'user';
                token.avatar = user.avatar || '';

                if (!user.accessToken) {
                    token.accessToken = token.accessToken || null;
                    token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
                } else {
                    token.accessToken = user.accessToken;
                    token.accessTokenExpires = user.accessTokenExpires;
                }
            }

            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                return token;
            }

            return {
                ...token,
                error: 'AccessTokenExpired',
            };
        },

        async session({ session, token }) {
            if (token.error === 'AccessTokenExpired') {
                session.user = undefined as any;
                (session as any).error = 'AccessTokenExpired';
                return session;
            }

            session.user._id = token.id as string;
            session.user.role = token.role as string;
            session.user.avatar = token.avatar as string;
            session.accessToken = token.accessToken as string;

            return session;
        },
    },

    pages: {
        signIn: '/signin',
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
