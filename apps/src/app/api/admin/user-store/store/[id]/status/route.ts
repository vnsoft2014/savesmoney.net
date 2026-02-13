import { NextRequest, NextResponse } from 'next/server';

import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { UserStore } from '@/models/UserStore';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(req: NextRequest, { params }: Props) {
    try {
        await connectDB();

        const { id } = await params;

        const body = await req.json();

        if (typeof body.isActive !== 'boolean') {
            return NextResponse.json({ success: false, message: 'isActive must be boolean' }, { status: 400 });
        }

        const updatedStore = await UserStore.findByIdAndUpdate(id, { isActive: body.isActive }, { new: true });

        if (!updatedStore) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.NOT_FOUND }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: MESSAGES.SUCCESS.UPDATED,
            data: updatedStore,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
}
