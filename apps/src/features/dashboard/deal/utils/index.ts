import { checkDuplicate } from '@/services/admin/deal';
import { CheckingDuplicateState } from '../types';

let duplicateTimeout: ReturnType<typeof setTimeout> | null = null;

export const debounceCheckDuplicate = (
    dealId: string | number,
    params: {
        purchaseLink?: string;
        shortDescription?: string;
    },
    setErrors: React.Dispatch<React.SetStateAction<any>>,
    setChecking: React.Dispatch<React.SetStateAction<CheckingDuplicateState>>,
) => {
    if (duplicateTimeout) {
        clearTimeout(duplicateTimeout);
    }

    duplicateTimeout = setTimeout(async () => {
        const { purchaseLink, shortDescription } = params;

        if (!purchaseLink && !shortDescription) {
            setErrors((prev: any) => ({
                ...prev,
                [dealId]: {
                    ...prev?.[dealId],
                    purchaseLink: undefined,
                    shortDescription: undefined,
                },
            }));

            setChecking((prev: any) => ({
                ...prev,
                [dealId]: {
                    purchaseLink: false,
                    shortDescription: false,
                },
            }));
            return;
        }

        setChecking((prev: any) => ({
            ...prev,
            [dealId]: {
                ...prev?.[dealId],
                purchaseLink: Boolean(purchaseLink),
                shortDescription: Boolean(shortDescription),
            },
        }));

        try {
            const isDuplicate = await checkDuplicate(shortDescription, purchaseLink);

            setErrors((prev: any) => ({
                ...prev,
                [dealId]: {
                    ...prev?.[dealId],
                    purchaseLink: purchaseLink
                        ? isDuplicate
                            ? 'Purchase link already exists'
                            : undefined
                        : prev?.[dealId]?.purchaseLink,

                    shortDescription: shortDescription
                        ? isDuplicate
                            ? 'Short description already exists'
                            : undefined
                        : prev?.[dealId]?.shortDescription,
                },
            }));
        } catch (err) {
            console.error('debounceCheckDuplicate error:', err);
        } finally {
            setChecking((prev: any) => ({
                ...prev,
                [dealId]: {
                    ...prev?.[dealId],
                    purchaseLink: false,
                    shortDescription: false,
                },
            }));
        }
    }, 500);
};
