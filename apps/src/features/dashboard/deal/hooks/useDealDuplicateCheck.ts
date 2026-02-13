import { checkDuplicate } from '@/services/admin/deal';
import { useRef } from 'react';

type DuplicateCheckParams = {
    shortDescription: string;
    purchaseLink: string;
};

type DuplicateCheckResponse = {
    isDuplicate: boolean;
};

export function useDealDuplicateCheck() {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const check = (params: DuplicateCheckParams, cb: (res: DuplicateCheckResponse) => void) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }

        timeout.current = setTimeout(async () => {
            const res = await checkDuplicate(params.shortDescription, params.purchaseLink);

            cb(res);
        }, 500);
    };

    return { check };
}
