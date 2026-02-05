import { DealType, Store } from '@/shared/types';
import { createContext, useContext } from 'react';
import { CheckingDuplicateState, UpdateDealFn } from '../types';

type DealContextType = {
    loadingMeta: boolean;
    dealTypes: DealType[];
    stores: Store[];
    deleteRow: (id: number) => void;
    updateDeal: UpdateDealFn;
    openDescriptionEditor: (id: number) => void;
    focusedDealId: number | null;
    setFocusedDealId: React.Dispatch<React.SetStateAction<number | null>>;
    checkingDuplicate: CheckingDuplicateState;
    setCheckingDuplicate: React.Dispatch<React.SetStateAction<CheckingDuplicateState>>;
    errors: any;
    setErrors: React.Dispatch<React.SetStateAction<any>>;
};

const DealContext = createContext<DealContextType | null>(null);

export const useDealContext = () => {
    const ctx = useContext(DealContext);
    if (!ctx) {
        throw new Error('useDealContext must be used inside DealProvider');
    }
    return ctx;
};

type DealProviderProps = {
    children: React.ReactNode;
    loadingMeta: boolean;
    dealTypes: DealType[];
    stores: Store[];
    deleteRow: (id: number) => void;
    updateDeal: UpdateDealFn;
    openDescriptionEditor: (id: number) => void;
    focusedDealId: number | null;
    setFocusedDealId: React.Dispatch<React.SetStateAction<number | null>>;
    checkingDuplicate: CheckingDuplicateState;
    setCheckingDuplicate: React.Dispatch<React.SetStateAction<CheckingDuplicateState>>;
    errors: any;
    setErrors: React.Dispatch<React.SetStateAction<any>>;
};

export function DealProvider({
    children,
    loadingMeta,
    dealTypes,
    stores,
    deleteRow,
    updateDeal,
    openDescriptionEditor,
    focusedDealId,
    setFocusedDealId,
    checkingDuplicate,
    setCheckingDuplicate,
    errors,
    setErrors,
}: DealProviderProps) {
    return (
        <DealContext.Provider
            value={{
                loadingMeta,
                dealTypes,
                stores,
                deleteRow,
                updateDeal,
                openDescriptionEditor,
                focusedDealId,
                setFocusedDealId,
                checkingDuplicate,
                setCheckingDuplicate,
                errors,
                setErrors,
            }}
        >
            {children}
        </DealContext.Provider>
    );
}
