import { Exporter } from '@/features/dashboard/export/types/export';

export const userExporter: Exporter<any> = {
    headers: ['No', 'Name', 'Email'],

    mapTxtRow: (u, index) => `${index + 1}\t${u.name}\t${u.email}`,

    mapXlsxRow: (u, index) => ({
        No: index + 1,
        Username: u.name,
        Email: u.email,
    }),
};
