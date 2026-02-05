import { checkDuplicate } from '@/services/admin/deal';
import { useRef } from 'react';

export function useDealDuplicateCheck() {
    const timeout = useRef<any>(null);

    const check = (params, cb) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(async () => {
            const res = await checkDuplicate(params.shortDescription, params.purchaseLink);
            cb(res);
        }, 500);
    };

    return { check };
}
