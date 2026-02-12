import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { UserStore } from '@/models/UserStore';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: Props) {
    try {
        await connectDB();

        const { id } = await params;

        let userStore = await UserStore.findById(id);

        if (userStore) {
            return NextResponse.json({ success: true, data: userStore });
        } else {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 204 });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
