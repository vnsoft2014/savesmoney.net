import { MESSAGES } from '@/constants/messages';
import { ADMIN_ONLY } from '@/constants/user';
import connectDB from '@/DB/connectDB';
import { createExportStream, exportDirect } from '@/lib/export/exportEngine';
import { subscriberExporter } from '@/lib/export/exporters/subscriber';
import { assertRole, authCheck } from '@/middleware/authCheck';
import Subscriber from '@/models/Subscriber';
import Joi from 'joi';
import { NextResponse } from 'next/server';

const ExportQuerySchema = Joi.object({
    format: Joi.string().valid('txt', 'xlsx').default('txt'),

    sortField: Joi.string().valid('_id', 'createdAt', 'name', 'subscribedAt').default('_id'),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),

    atFrom: Joi.string().allow('').optional(),
    subscribedAtTo: Joi.string().allow('').optional(),
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

    const { format, sortField, sortOrder, subscribedAtFrom, subscribedAtTo } = value;

    const query: any = {};

    if (subscribedAtFrom || subscribedAtTo) {
        query.subscribedAt = {};

        if (subscribedAtFrom) {
            const fromDate = new Date(`${subscribedAtFrom}T00:00:00.000Z`);
            if (!isNaN(fromDate.getTime())) {
                query.subscribedAt.$gte = fromDate;
            }
        }

        if (subscribedAtTo) {
            const toDate = new Date(`${subscribedAtTo}T23:59:59.999Z`);
            if (!isNaN(toDate.getTime())) {
                query.subscribedAt.$lte = toDate;
            }
        }

        if (Object.keys(query.subscribedAt).length === 0) {
            delete query.subscribedAt;
        }
    }

    const totalCount = await Subscriber.countDocuments(query);

    if (totalCount === 0) {
        return NextResponse.json({ success: false, message: 'No data to export' }, { status: 400 });
    }

    const exporter = subscriberExporter;

    if (totalCount < 1000) {
        const result = await exportDirect({
            model: Subscriber,
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
        model: Subscriber,
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
