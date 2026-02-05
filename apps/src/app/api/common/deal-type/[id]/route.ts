import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import DealType from '@/models/DealType';
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

        const dealType = await DealType.findById(id);

        if (!dealType) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Deal Type not found',
                },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            data: dealType,
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
