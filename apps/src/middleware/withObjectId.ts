import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

type ParamsWithId = Promise<{ id: string }>;

type RouteContext<P = ParamsWithId> = {
    params: P;
};

export function withObjectId<P extends ParamsWithId>(
    handler: (req: Request, ctx: RouteContext<P>) => Promise<Response>,
) {
    return async (req: Request, ctx: RouteContext<P>) => {
        const resolvedParams = await ctx.params;
        const { id } = resolvedParams;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, message: 'Invalid id' }, { status: 400 });
        }

        return handler(req, ctx);
    };
}
