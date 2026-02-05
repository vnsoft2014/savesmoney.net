export type ExportFormat = 'txt' | 'xlsx';

export interface ExportProgressPayload {
    progress?: number;
    total?: number;
    current?: number;
    completed?: boolean;
    fileContent?: string;
    filename?: string;
    contentType?: string;
    error?: string;
}

export interface ExportWithProgressOptions {
    format: 'txt' | 'xlsx';

    params?: URLSearchParams;

    request: (query: string) => Promise<Response>;

    onStart?: () => void;
    onProgress?: (data: { progress: number; total: number; current: number }) => void;
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onFinish?: () => void;
}
