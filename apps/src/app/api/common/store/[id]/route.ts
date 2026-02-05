import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import Store from '@/models/Store';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_: Request, { params }: Props) {
    try {
        await connectDB();

        const { id } = await params;

        const store = await Store.findById(id);

        if (!store) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Store not found',
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: store,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
                error,
            },
            { status: 500 },
        );
    }
}
