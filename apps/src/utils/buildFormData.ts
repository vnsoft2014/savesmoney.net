export function buildFormData(values: Record<string, any>): FormData {
    const fd = new FormData();

    for (const [key, value] of Object.entries(values)) {
        if (value instanceof File) {
            fd.append(key, value);
            continue;
        }

        if (Array.isArray(value)) {
            if (typeof value[0] === 'object') {
                value.forEach((item) => {
                    fd.append(key, JSON.stringify(item));
                });
            } else {
                value.forEach((item) => {
                    fd.append(key, String(item));
                });
            }
            continue;
        }

        fd.append(key, String(value));
    }

    return fd;
}
