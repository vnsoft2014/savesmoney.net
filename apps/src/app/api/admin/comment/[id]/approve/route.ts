import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

import { MESSAGES } from '@/constants/messages';
import { ADMIN_ROLES } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { withObjectId } from '@/middleware/withObjectId';
import Comment from '@/models/Comment';

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export const PATCH = withObjectId(async (req: Request, { params }: Props) => {
    try {
        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json({ success: false, message: MESSAGES.ERROR.FORBIDDEN }, { status: 401 });
        }

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: 'Invalid comment id' }, { status: 400 });
        }

        const body = await req.json();
        const { isApproved } = body;

        if (typeof isApproved !== 'boolean') {
            return NextResponse.json({ success: false, message: 'isApproved must be boolean' }, { status: 400 });
        }

        await connectDB();

        const updated = await Comment.findByIdAndUpdate(id, { isApproved }, { new: true });

        if (!updated) {
            return NextResponse.json({ success: false, message: 'Comment not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Approve status updated.',
            data: {
                _id: updated._id,
                isApproved: updated.isApproved,
            },
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: MESSAGES.ERROR.INTERNAL_SERVER }, { status: 500 });
    }
});
