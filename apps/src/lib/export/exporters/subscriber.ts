import { Exporter } from '@/shared/types';
import { formatDate } from '@/utils/utils';

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
