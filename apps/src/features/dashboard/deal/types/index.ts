import { DealFormValues } from '@/types';

export type UpdateDealFn = <K extends keyof DealFormValues>(id: number, field: K, value: DealFormValues[K]) => void;

export type CheckingDuplicateState = {
    [dealId: number]: {
        purchaseLink?: boolean;
        shortDescription?: boolean;
    };
};
