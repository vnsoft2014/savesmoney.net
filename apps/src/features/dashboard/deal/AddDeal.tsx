'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { getDealTypes, getStores } from '@/services';
import { addNewDeals } from '@/services/admin/deal';
import { DealFormValues, DealType, Store } from '@/shared/types';
import { stripHtmlTags } from '@/utils/utils';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { DealTable, QuillEditorModal } from './components/AddDeal';
import { DealProvider } from './contexts';
import { CheckingDuplicateState } from './types';

type DealField = keyof DealFormValues;

type DealErrors = {
    [id: number]: Partial<Record<DealField, string>>;
};

export default function AddDeal() {
    const router = useRouter();

    const [loader, setLoader] = useState(false);

    const { user } = useAuth();

    const [deals, setDeals] = useState<DealFormValues[]>([]);
    const [focusedDealId, setFocusedDealId] = useState<number | null>(null);

    const [errors, setErrors] = useState<DealErrors>({});

    const [dealTypes, setDealTypes] = useState<DealType[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(false);

    const [editorModal, setEditorModal] = useState<{ isOpen: boolean; dealId: number | null }>({
        isOpen: false,
        dealId: null,
    });

    const [checkingDuplicate, setCheckingDuplicate] = useState<CheckingDuplicateState>({});

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = 'Add Deal | Admin Dashboard';
    }, []);

    useEffect(() => {
        const fetchMetaData = async () => {
            setLoadingMeta(true);

            const [dealTypesData, storesData] = await Promise.all([getDealTypes(), getStores()]);

            setDealTypes(dealTypesData);

            setStores(storesData);
            setLoadingMeta(false);
        };

        fetchMetaData();
    }, []);

    const addNewRow = () => {
        const newDeal = {
            id: Date.now(),
            picture: null,
            dealType: [],
            store: '',
            expireAt: '',
            shortDescription: '',
            originalPrice: 0,
            discountPrice: 0,
            percentageOff: '',
            purchaseLink: '',
            description: '',
            flashDeal: false,
            flashDealExpireHours: null,
            couponCode: '',
            tags: [],
            hotTrend: false,
            holidayDeals: false,
            seasonalDeals: false,
            coupon: false,
            clearance: false,
            disableExpireAt: false,
            author: user!._id,
        };
        setDeals([...deals, newDeal]);
    };

    const deleteRow = (id: number): void => {
        if (deals.length > 1) {
            setDeals(deals.filter((deal) => deal.id !== id));

            const newErrors = { ...errors };
            delete newErrors[id];
            setErrors(newErrors);

            if (focusedDealId === id) {
                setFocusedDealId(null);
            }
        } else {
            toast.warning('At least one deal is required!');
        }
    };

    const updateDeal = <K extends keyof DealFormValues>(id: number, field: K, value: DealFormValues[K]): void => {
        setDeals((prev) =>
            prev.map((deal) => {
                if (deal.id === id) {
                    const updatedDeal = { ...deal, [field]: value };

                    if (field === 'originalPrice' || field === 'discountPrice') {
                        const original = field === 'originalPrice' ? Number(value) : deal.originalPrice;
                        const discount = field === 'discountPrice' ? Number(value) : deal.discountPrice;

                        if (original > 0) {
                            if (discount === 0 || discount >= original) {
                                updatedDeal.percentageOff = '0%';
                            } else if (discount > 0 && discount < original) {
                                const percentage = Math.round(((original - discount) / original) * 100);
                                updatedDeal.percentageOff = `${percentage}%`;
                            }
                        }
                    } else if (
                        (field === 'coupon' && updatedDeal.coupon) ||
                        (field === 'clearance' && updatedDeal.clearance) ||
                        (field === 'disableExpireAt' && updatedDeal.disableExpireAt) ||
                        (field === 'flashDeal' && updatedDeal.flashDeal)
                    ) {
                        updatedDeal.expireAt = null;
                    }

                    return updatedDeal;
                }
                return deal;
            }),
        );

        if (errors[id]?.[field]) {
            setErrors((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    [field]: undefined,
                },
            }));
        }
    };

    const openDescriptionEditor = (dealId: number) => {
        setEditorModal({ isOpen: true, dealId });
    };

    const closeDescriptionEditor = () => {
        setEditorModal({ isOpen: false, dealId: null });
    };

    const handleDescriptionChange = (value: string) => {
        if (editorModal.dealId !== null) {
            updateDeal(editorModal.dealId, 'description', value);
        }
    };

    const getCurrentDescription = () => {
        if (editorModal.dealId === null) return '';
        const deal = deals.find((d) => d.id === editorModal.dealId);
        return deal?.description || '';
    };

    const saveAllDeals = async () => {
        if (deals.length === 0) {
            toast.warning('Please add at least one deal before saving!');
            return;
        }

        const newErrors: DealErrors = {};
        let hasError = false;

        deals.forEach((deal) => {
            const dealErrors: DealErrors[number] = {};

            if (!deal.picture) {
                dealErrors.picture = 'Picture is required';
                hasError = true;
            }

            if (!deal.dealType || deal.dealType.length === 0) {
                dealErrors.dealType = 'Deal Type is required';
            }

            if (!deal.store) {
                dealErrors.store = 'Deal Store is required';
                hasError = true;
            }

            if (!deal.coupon && !deal.clearance && !deal.disableExpireAt && !deal.flashDeal) {
                if (!deal.expireAt) {
                    dealErrors.expireAt = 'Expiry Date is required';
                    hasError = true;
                } else {
                    const selectedDate = new Date(deal.expireAt);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        dealErrors.expireAt = 'Expiry Date must be today or in the future';
                        hasError = true;
                    }
                }
            } else {
                dealErrors.expireAt = undefined;
            }

            if (deal.flashDeal) {
                if (deal.flashDealExpireHours === null) {
                    dealErrors.flashDealExpireHours = 'Flash deal duration is required';
                    hasError = true;
                } else if (typeof deal.flashDealExpireHours !== 'number' || deal.flashDealExpireHours <= 0) {
                    dealErrors.flashDealExpireHours = 'Flash deal duration must be greater than 0';
                    hasError = true;
                }
            }

            if (!deal.shortDescription.trim()) {
                dealErrors.shortDescription = 'Deal Short Description is required';
                hasError = true;
            } else {
                if (errors[deal.id]?.shortDescription === 'Short description already exists') {
                    dealErrors.shortDescription = 'Short description already exists';
                    hasError = true;
                }

                if (checkingDuplicate[deal.id]?.shortDescription) {
                    dealErrors.shortDescription = 'Checking short description, please wait...';
                    hasError = true;
                }
            }

            if (!deal.originalPrice || deal.originalPrice <= 0) {
                dealErrors.originalPrice = 'Original Price is required and must be greater than 0';
                hasError = true;
            }

            if (deal.discountPrice < 0) {
                dealErrors.discountPrice = 'Discount Price cannot be negative';
                hasError = true;
            }

            if (deal.discountPrice >= deal.originalPrice && deal.originalPrice > 0) {
                dealErrors.discountPrice = 'Discount Price must be less than Original Price';
                hasError = true;
            }

            if (!deal.purchaseLink.trim()) {
                dealErrors.purchaseLink = 'Purchase Link is required';
                hasError = true;
            } else {
                try {
                    const urlToValidate = deal.purchaseLink.match(/^https?:\/\//)
                        ? deal.purchaseLink
                        : `https://${deal.purchaseLink}`;

                    new URL(urlToValidate);
                    deal.purchaseLink = urlToValidate;

                    if (errors[deal.id]?.purchaseLink === 'Purchase link already exists') {
                        dealErrors.purchaseLink = 'Purchase link already exists';
                        hasError = true;
                    }

                    if (checkingDuplicate[deal.id]?.purchaseLink) {
                        dealErrors.purchaseLink = 'Checking purchase link, please wait...';
                        hasError = true;
                    }
                } catch {
                    dealErrors.purchaseLink = 'Invalid URL format';
                    hasError = true;
                }
            }

            if (!deal.description.trim() || stripHtmlTags(deal.description).trim().length === 0) {
                dealErrors.description = 'Description is required';
                hasError = true;
            }

            if (Object.keys(dealErrors).length > 0) {
                newErrors[deal.id] = dealErrors;
            }
        });

        setErrors(newErrors);

        console.log(newErrors);

        if (hasError) {
            toast.error('Please fix all errors before saving!');
            return;
        }

        setLoader(true);

        const res = await addNewDeals(deals);

        if (res.success) {
            toast.success(res?.message);
            setDeals([]);
            setErrors({});
            router.push('/dashboard');
            setLoader(false);
        } else {
            toast.error(res?.message);
            setLoader(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">Add Deal</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={addNewRow}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            Add Deal
                        </button>
                        <button
                            onClick={saveAllDeals}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors"
                        >
                            <Save size={20} />
                            Save All
                        </button>
                    </div>
                </div>

                {deals.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Tip:</strong> Click on the paste area to focus it, then press{' '}
                            <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs">Ctrl+V</kbd> to
                            paste an image from your clipboard!
                        </p>
                    </div>
                )}

                {loader ? (
                    <div className="w-full flex-col h-96 flex items-center justify-center">
                        <TailSpin
                            height="50"
                            width="50"
                            color="orange"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            wrapperClass=""
                            visible={true}
                        />
                        <p className="text-sm mt-2 font-semibold text-orange-500">Adding Deal Hold Tight ....</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <DealProvider
                                loadingMeta={loadingMeta}
                                dealTypes={dealTypes}
                                stores={stores}
                                deleteRow={deleteRow}
                                updateDeal={updateDeal}
                                openDescriptionEditor={openDescriptionEditor}
                                focusedDealId={focusedDealId}
                                setFocusedDealId={setFocusedDealId}
                                checkingDuplicate={checkingDuplicate}
                                setCheckingDuplicate={setCheckingDuplicate}
                                errors={errors}
                                setErrors={setErrors}
                            >
                                <DealTable
                                    deals={deals}
                                    onAddDeal={addNewRow}
                                    onSave={saveAllDeals}
                                    loading={loading}
                                />
                            </DealProvider>
                        </div>
                    </div>
                )}

                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        Total deals: <span className="font-semibold">{deals.length}</span>
                    </p>
                </div>
            </div>

            <QuillEditorModal
                isOpen={editorModal.isOpen}
                onClose={closeDescriptionEditor}
                value={getCurrentDescription()}
                onChange={handleDescriptionChange}
            />
        </div>
    );
}
