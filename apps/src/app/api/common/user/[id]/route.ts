import { MESSAGES } from '@/constants/messages';
import connectDB from '@/DB/connectDB';
import { withObjectId } from '@/middleware/withObjectId';
import User from '@/models/User';
import { NextResponse } from 'next/server';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export const GET = withObjectId(async (_: Request, { params }: Props) => {
    try {
        await connectDB();

        const { id } = await params;

        const user = await User.findById(id).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER, error }, { status: 500 });
    }
});
