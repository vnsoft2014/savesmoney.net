import { Model } from 'mongoose';

export interface Exporter<T> {
    headers: string[];
    mapTxtRow: (doc: T, index: number) => string;
    mapXlsxRow: (doc: T, index: number) => Record<string, any>;
}

export interface ExportConfig<T> {
    model: Model<T>;
    query: Record<string, any>;
    sortField: keyof T | string;
    sortOrder: 1 | -1;
    format: 'txt' | 'xlsx';
    exporter: Exporter<T>;
    batchSize?: number;
}
