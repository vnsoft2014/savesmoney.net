import { formatDate } from '@/lib/utils';
import { Exporter } from '@/types';

export const subscriberExporter: Exporter<any> = {
    headers: ['No', 'Name', 'Email', 'Subscribed At'],

    mapTxtRow: (s, index) => `${index + 1}\t${s.name}\t${s.email}\t${formatDate(s.subscribedAt)}`,

    mapXlsxRow: (s, index) => ({
        No: index + 1,
        Name: s.name,
        Email: s.email,
        'Subscribed At': formatDate(s.subscribedAt),
    }),
};
