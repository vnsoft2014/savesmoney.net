import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { createExportStream, exportDirect } from '@/lib/export/exportEngine';
import { userExporter } from '@/lib/export/exporters/user';
import { assertRole, authCheck } from '@/middleware/authCheck';
import User from '@/models/User';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const ExportQuerySchema = Joi.object({
    format: Joi.string().valid('txt', 'xlsx').default('txt'),
    sortField: Joi.string().valid('_id', 'createdAt', 'name').default('_id'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export async function GET(req: Request) {
    await connectDB();

    const role = await authCheck(req);
    if (!assertRole(role, ADMIN_ONLY)) {
        return NextResponse.json({
            success: false,
            message: MESSAGES.ERROR.FORBIDDEN,
        });
    }

    const { searchParams } = new URL(req.url);

    const { value, error } = ExportQuerySchema.validate(Object.fromEntries(searchParams.entries()), { convert: true });

    if (error) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.VALIDATION,
            },
            { status: 400 },
        );
    }

    const { format, sortField, sortOrder } = value;

    const query: any = {
        role: 'user',
    };

    const totalCount = await User.countDocuments(query);

    if (totalCount === 0) {
        return NextResponse.json({ success: false, message: 'No data to export' }, { status: 400 });
    }

    const exporter = userExporter;

    if (totalCount < 1000) {
        const result = await exportDirect({
            model: User,
            query,
            sortField,
            sortOrder,
            format,
            exporter,
        });

        return new NextResponse(result.body, {
            headers: {
                'Content-Type': result.contentType,
                'Content-Disposition': `attachment; filename=${result.filename}`,
            },
        });
    }

    const stream = createExportStream({
        model: User,
        query,
        sortField,
        sortOrder,
        format,
        exporter,
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
