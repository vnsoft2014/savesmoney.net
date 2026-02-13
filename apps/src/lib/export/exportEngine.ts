import { ExportConfig, Exporter } from '@/shared/types';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';

export async function exportDirect<T>({
    model,
    query,
    sortField,
    sortOrder,
    format,
    exporter,
}: {
    model: Model<T>;
    query: Record<string, any>;
    sortField: keyof T | string;
    sortOrder: 1 | -1;
    format: 'txt' | 'xlsx';
    exporter: Exporter<T>;
}) {
    const docs = await model
        .find(query)
        .sort({ [sortField]: sortOrder })
        .lean<T[]>();

    if (format === 'txt') {
        const rows = docs.map((doc, i) => exporter.mapTxtRow(doc, i));

        return {
            body: [exporter.headers.join('\t'), ...rows].join('\n'),
            contentType: 'text/plain; charset=utf-8',
            filename: `export_${Date.now()}.txt`,
        };
    }

    const data = docs.map((doc, i) => exporter.mapXlsxRow(doc, i));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Export');

    return {
        body: XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }),
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `export_${Date.now()}.xlsx`,
    };
}

export function createExportStream<T>({
    model,
    query,
    sortField,
    sortOrder,
    format,
    exporter,
    batchSize = 500,
}: ExportConfig<T>) {
    const encoder = new TextEncoder();

    return new ReadableStream({
        async start(controller) {
            try {
                const totalCount = await model.countDocuments(query);
                const totalBatches = Math.ceil(totalCount / batchSize);

                let processed = 0;

                for (let batch = 0; batch < totalBatches; batch++) {
                    const docs = await model
                        .find(query)
                        .sort({ [sortField]: sortOrder })
                        .skip(batch * batchSize)
                        .limit(batchSize)
                        .lean();

                    processed += docs.length;

                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({
                                progress: Math.round(((batch + 1) / totalBatches) * 100),
                                total: totalCount,
                                current: processed,
                            })}\n\n`,
                        ),
                    );
                }

                const result = await exportDirect<T>({
                    model,
                    query,
                    sortField,
                    sortOrder,
                    format,
                    exporter,
                });

                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({
                            completed: true,
                            progress: 100,
                            fileContent: Buffer.from(result.body).toString('base64'),
                            contentType: result.contentType,
                            filename: result.filename,
                        })}\n\n`,
                    ),
                );

                controller.close();
            } catch (error) {
                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({
                            error: 'Export failed',
                        })}\n\n`,
                    ),
                );
                controller.close();
            }
        },
    });
}
