import { ExportProgressPayload, ExportWithProgressOptions } from '../types';

const downloadBase64File = (base64: string, filename: string, contentType: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: contentType });
    downloadBlob(blob, filename);
};

const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export const exportWithProgress = async ({
    format,
    params,
    request,
    onStart,
    onProgress,
    onSuccess,
    onError,
    onFinish,
}: ExportWithProgressOptions) => {
    try {
        onStart?.();

        const finalParams = params ?? new URLSearchParams();
        finalParams.set('format', format);

        const response = await request(finalParams.toString());
        const contentType = response.headers.get('Content-Type');

        // ===== SSE export =====
        if (contentType?.includes('text/event-stream')) {
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;

                    const data: ExportProgressPayload = JSON.parse(line.substring(6));

                    if (data.error) {
                        throw new Error(data.error);
                    }

                    if (data.progress !== undefined) {
                        onProgress?.({
                            progress: data.progress,
                            total: data.total || 0,
                            current: data.current || 0,
                        });
                    }

                    if (data.completed && data.fileContent) {
                        downloadBase64File(
                            data.fileContent,
                            data.filename || `export_${Date.now()}.${format}`,
                            data.contentType || 'application/octet-stream',
                        );

                        onSuccess?.();
                    }
                }
            }
        }
        // ===== Direct download =====
        else {
            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filenameMatch = contentDisposition?.match(/filename=(.+)/);
            const filename = filenameMatch?.[1] || `export_${Date.now()}.${format}`;

            // Fake progress UI
            onProgress?.({ progress: 50, total: 100, current: 50 });
            await new Promise((r) => setTimeout(r, 200));
            onProgress?.({ progress: 100, total: 100, current: 100 });

            downloadBlob(blob, filename);
            onSuccess?.();
        }
    } catch (err) {
        onError?.(err);
    } finally {
        onFinish?.();
    }
};
