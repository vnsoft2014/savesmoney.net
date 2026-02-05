'use client';

import QuillEditorModal from '@/features/dashboard/deal/components/QuilEditorModal';
import { addNewDeals, checkDuplicate } from '@/services/admin/deal';
import { getDealTypes } from '@/services/admin/deal-type';
import { getStores } from '@/services/admin/store';
import { RootState } from '@/store/store';
import { Deal, DealTypeData, UserData } from '@/types';
import { stripHtmlTags } from '@/utils/utils';
import Cookies from 'js-cookie';
import { ArrowLeft, Clipboard, Edit, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';

type DealField = keyof Deal;

type DealErrors = {
    [id: number]: Partial<Record<DealField, string>>;
};

type CheckingDuplicateState = {
    [dealId: number]: {
        purchaseLink?: boolean;
        shortDescription?: boolean;
    };
};

let duplicateTimeout: ReturnType<typeof setTimeout> | null = null;

const debounceCheckDuplicate = (
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
            const res = await checkDuplicate(shortDescription, purchaseLink);

            setErrors((prev: any) => ({
                ...prev,
                [dealId]: {
                    ...prev?.[dealId],
                    purchaseLink: purchaseLink
                        ? res?.isDuplicate
                            ? 'Purchase link already exists'
                            : undefined
                        : prev?.[dealId]?.purchaseLink,

                    shortDescription: shortDescription
                        ? res?.isDuplicate
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

export default function AddDeal() {
    const [loader, setLoader] = useState(false);
    const Router = useRouter();

    const [dealTypes, setDealTypes] = useState<DealTypeData[]>([]);
    const [stores, setStores] = useState<{ _id: string; name: string }[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(false);

    const [deals, setDeals] = useState<Deal[]>([]);
    const [errors, setErrors] = useState<DealErrors>({});
    const [focusedDealId, setFocusedDealId] = useState<number | null>(null);

    const [editorModal, setEditorModal] = useState<{ isOpen: boolean; dealId: number | null }>({
        isOpen: false,
        dealId: null,
    });

    const [checkingDuplicate, setCheckingDuplicate] = useState<CheckingDuplicateState>({});

    const user = useSelector((state: RootState) => state.User.userData) as UserData | null;

    useEffect(() => {
        document.title = 'Add Deal | Admin Dashboard';
    }, []);

    // Global paste event listener
    useEffect(() => {
        const handleGlobalPaste = async (e: ClipboardEvent) => {
            // Only handle if we have a focused deal and not in editor modal
            if (!focusedDealId || editorModal.isOpen) return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        const fakeEvent = {
                            target: {
                                files: [file],
                            },
                        };
                        await handleImageUpload(focusedDealId, fakeEvent);
                    }
                    break;
                }
            }
        };

        document.addEventListener('paste', handleGlobalPaste);
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [focusedDealId, editorModal.isOpen]);

    useEffect(() => {
        const fetchMetaData = async () => {
            try {
                setLoadingMeta(true);

                const [dealTypeData, storeData] = await Promise.all([getDealTypes(), getStores()]);

                if (dealTypeData?.success) {
                    setDealTypes(dealTypeData.data);
                } else {
                    toast.error('Failed to load deal types');
                }

                if (storeData?.success) {
                    setStores(storeData.data);
                } else {
                    toast.error('Failed to load stores');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error loading deal metadata');
            } finally {
                setLoadingMeta(false);
            }
        };

        fetchMetaData();

        return () => {
            if (duplicateTimeout) {
                clearTimeout(duplicateTimeout);
            }
        };
    }, []);

    const addNewRow = () => {
        const newDeal = {
            id: Date.now(),
            picture: null,
            dealType: [],
            store: '',
            expiredDate: '',
            shortDescription: '',
            originalPrice: 0,
            discountPrice: 0,
            percentageOff: '',
            purchaseLink: '',
            description: '',
            hotTrend: false,
            holidayDeals: false,
            seasonalDeals: false,
            coupon: false,
            clearance: false,
            disableExpireAt: false,
            author: user?._id,
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
            alert('At least one deal is required!');
        }
    };

    const updateDeal = <K extends keyof Deal>(id: number, field: K, value: Deal[K]): void => {
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
                        (field === 'disableExpireAt' && updatedDeal.disableExpireAt)
                    ) {
                        updatedDeal.expiredDate = null;
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

    const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});

    const handleImageUpload = async (id: number, e: React.ChangeEvent<HTMLInputElement> | any): Promise<void> => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('File size too large. Maximum 5MB allowed.');
            return;
        }

        // Show loading state
        setUploadingImages((prev) => ({ ...prev, [id]: true }));

        const reader = new FileReader();
        reader.onloadend = () => {
            updateDeal(id, 'picture', reader.result as string);
        };
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                updateDeal(id, 'picture', result.url);
                toast.success('Image uploaded successfully!');
            } else {
                toast.error(result.message || 'Failed to upload image');
                updateDeal(id, 'picture', null);
            }
        } catch (error) {
            toast.error('Failed to upload image. Please try again.');
            updateDeal(id, 'picture', null);
        } finally {
            setUploadingImages((prev) => ({ ...prev, [id]: false }));
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
            alert('Please add at least one deal before saving!');
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

            if (!deal.coupon && !deal.clearance && !deal.disableExpireAt) {
                if (!deal.expiredDate) {
                    dealErrors.expiredDate = 'Expiry Date is required';
                    hasError = true;
                } else {
                    const selectedDate = new Date(deal.expiredDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (selectedDate < today) {
                        dealErrors.expiredDate = 'Expiry Date must be today or in the future';
                        hasError = true;
                    }
                }
            } else {
                dealErrors.expiredDate = undefined;
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
            Router.push('/dashboard');
            setLoader(false);
        } else {
            toast.error(res?.message);
            setLoader(false);
        }
    };

    // Picture Upload Cell Component with Clipboard Support
    const PictureUploadCell = ({ deal }: { deal: Deal }) => {
        const fileInputRef = useRef<HTMLInputElement | null>(null);
        const containerRef = useRef(null);

        const handleContainerClick = () => {
            if (!uploadingImages[deal.id]) {
                fileInputRef.current?.click();
            }
        };

        const handleFocus = () => {
            setFocusedDealId(deal.id);
        };

        const handleBlur = () => {
            // Delay to allow paste event to fire
            setTimeout(() => {
                if (focusedDealId === deal.id) {
                    setFocusedDealId(null);
                }
            }, 7000);
        };

        return (
            <td className="px-4 py-3">
                <div className="flex flex-col items-center gap-2">
                    {uploadingImages[deal.id] && (
                        <div className="text-xs text-blue-600 font-medium animate-pulse">Uploading...</div>
                    )}

                    {deal.picture && (
                        <div className="relative group">
                            <img
                                src={deal.picture}
                                alt="Deal"
                                className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                            />
                            <button
                                onClick={handleContainerClick}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                                title="Change image"
                            >
                                <Upload size={20} className="text-white" />
                            </button>
                        </div>
                    )}

                    {!deal.picture && (
                        <div
                            ref={containerRef}
                            tabIndex={0}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onClick={handleContainerClick}
                            className={`w-full border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all outline-none ${
                                uploadingImages[deal.id]
                                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
                                    : focusedDealId === deal.id
                                      ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-300'
                                      : 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400'
                            }`}
                            title="Click to upload or focus and press Ctrl+V to paste"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <Clipboard size={20} className="text-blue-600" />
                                <span className="text-xs text-gray-600 font-medium">
                                    {focusedDealId === deal.id ? 'Press Ctrl+V' : 'Click or Focus'}
                                </span>
                            </div>
                        </div>
                    )}

                    <input
                        key={deal.id}
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(e) => handleImageUpload(deal.id, e)}
                        disabled={uploadingImages[deal.id]}
                        className="hidden"
                    />

                    {errors[deal.id]?.picture && (
                        <span className="text-xs text-red-500 font-medium">{errors[deal.id].picture}</span>
                    )}
                </div>
            </td>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => Router.push('/dashboard')}
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

                {/* Instructions */}
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
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">
                                            No.
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                                            Picture
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-60">
                                            Deal Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">
                                            Deal Store
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">
                                            Exp. Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">
                                            Short Description
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                                            Orig. Price
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                                            Dis. Price
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                                            % Off
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">
                                            Purchase Link
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-64">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-64">
                                            More
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-20">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deals.map((deal, index) => {
                                        const isDisableExpireAt = deal.disableExpireAt || deal.coupon || deal.clearance;

                                        return (
                                            <tr key={deal.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>

                                                {/* Picture with Clipboard Support */}
                                                <PictureUploadCell deal={deal} />

                                                {/* Deal Type */}
                                                <td className="px-4 py-3">
                                                    <Select
                                                        isMulti
                                                        menuPortalTarget={
                                                            typeof window !== 'undefined' ? document.body : null
                                                        }
                                                        menuPosition="fixed"
                                                        menuPlacement="auto"
                                                        isLoading={loadingMeta}
                                                        isDisabled={loadingMeta}
                                                        placeholder="Select deal type"
                                                        className="text-sm"
                                                        classNamePrefix="react-select"
                                                        options={dealTypes.map((type) => ({
                                                            value: type._id,
                                                            label: type.name,
                                                        }))}
                                                        value={dealTypes
                                                            .filter((type) => deal.dealType.includes(type._id))
                                                            .map((type) => ({
                                                                value: type._id,
                                                                label: type.name,
                                                            }))}
                                                        onChange={(selectedOptions) =>
                                                            updateDeal(
                                                                deal.id,
                                                                'dealType',
                                                                selectedOptions.map((opt) => opt.value),
                                                            )
                                                        }
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                minHeight: '38px',
                                                                borderColor: errors[deal.id]?.dealType
                                                                    ? '#ef4444'
                                                                    : state.isFocused
                                                                      ? '#3b82f6'
                                                                      : base.borderColor,
                                                                boxShadow: 'none',
                                                                '&:hover': {
                                                                    borderColor: '#3b82f6',
                                                                },
                                                            }),
                                                        }}
                                                    />

                                                    {errors[deal.id]?.dealType && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].dealType}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Deal Store */}
                                                <td className="px-4 py-3">
                                                    <Select
                                                        menuPortalTarget={
                                                            typeof window !== 'undefined' ? document.body : null
                                                        }
                                                        menuPosition="fixed"
                                                        menuPlacement="auto"
                                                        isLoading={loadingMeta}
                                                        isDisabled={loadingMeta}
                                                        placeholder="Select store"
                                                        className="text-sm"
                                                        classNamePrefix="react-select"
                                                        options={stores.map((store) => ({
                                                            value: store._id,
                                                            label: store.name,
                                                        }))}
                                                        value={
                                                            stores
                                                                .filter((store) => store._id === deal.store)
                                                                .map((store) => ({
                                                                    value: store._id,
                                                                    label: store.name,
                                                                }))[0] || null
                                                        }
                                                        onChange={(selected) =>
                                                            updateDeal(deal.id, 'store', selected?.value || '')
                                                        }
                                                        styles={{
                                                            control: (base, state) => ({
                                                                ...base,
                                                                minHeight: '38px',
                                                                borderColor: errors[deal.id]?.store
                                                                    ? '#ef4444'
                                                                    : state.isFocused
                                                                      ? '#3b82f6'
                                                                      : base.borderColor,
                                                                boxShadow: 'none',
                                                                '&:hover': {
                                                                    borderColor: '#3b82f6',
                                                                },
                                                            }),
                                                        }}
                                                    />

                                                    {errors[deal.id]?.store && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].store}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Expired Date */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="date"
                                                            value={deal.expiredDate || ''}
                                                            onChange={(e) =>
                                                                updateDeal(deal.id, 'expiredDate', e.target.value)
                                                            }
                                                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                                errors[deal.id]?.expiredDate
                                                                    ? 'border-red-500'
                                                                    : 'border-gray-300'
                                                            }`}
                                                            disabled={isDisableExpireAt}
                                                        />

                                                        <input
                                                            type="checkbox"
                                                            checked={deal.disableExpireAt}
                                                            onChange={(e) =>
                                                                updateDeal(deal.id, 'disableExpireAt', e.target.checked)
                                                            }
                                                            disabled={deal.coupon || deal.clearance}
                                                            className="w-5 h-5 accent-green-600"
                                                        />
                                                    </div>
                                                    {errors[deal.id]?.expiredDate && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].expiredDate}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Short Description */}
                                                <td className="px-4 py-3">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={deal.shortDescription}
                                                            onChange={(e) => {
                                                                const value = e.target.value;

                                                                updateDeal(deal.id, 'shortDescription', value);

                                                                debounceCheckDuplicate(
                                                                    deal.id,
                                                                    {
                                                                        shortDescription: value,
                                                                    },
                                                                    setErrors,
                                                                    setCheckingDuplicate,
                                                                );
                                                            }}
                                                            placeholder="Deal short"
                                                            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                                errors[deal.id]?.shortDescription
                                                                    ? 'border-red-500'
                                                                    : 'border-gray-300'
                                                            }`}
                                                        />
                                                        {/* Loading icon */}
                                                        {checkingDuplicate[deal.id]?.shortDescription && (
                                                            <span className="absolute inset-y-0 right-2 flex items-center">
                                                                <svg
                                                                    className="animate-spin h-4 w-4 text-gray-500"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    />
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {errors[deal.id]?.shortDescription && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].shortDescription}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Original Price */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={deal.originalPrice || ''}
                                                        onChange={(e) =>
                                                            updateDeal(deal.id, 'originalPrice', Number(e.target.value))
                                                        }
                                                        placeholder="299"
                                                        min="0"
                                                        step="0.01"
                                                        className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                            errors[deal.id]?.originalPrice
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {errors[deal.id]?.originalPrice && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].originalPrice}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Discount Price */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={deal.discountPrice || ''}
                                                        onChange={(e) =>
                                                            updateDeal(deal.id, 'discountPrice', Number(e.target.value))
                                                        }
                                                        placeholder="269"
                                                        min="0"
                                                        step="0.01"
                                                        className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                            errors[deal.id]?.discountPrice
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                        }`}
                                                    />
                                                    {errors[deal.id]?.discountPrice && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].discountPrice}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Percentage Off */}
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={deal.percentageOff}
                                                        readOnly
                                                        placeholder="Auto"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm text-gray-600"
                                                    />
                                                </td>

                                                {/* Purchase Link */}
                                                <td className="px-4 py-3">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={deal.purchaseLink}
                                                            onChange={(e) => {
                                                                const value = e.target.value;

                                                                updateDeal(deal.id, 'purchaseLink', value);

                                                                debounceCheckDuplicate(
                                                                    deal.id,
                                                                    {
                                                                        purchaseLink: value,
                                                                    },
                                                                    setErrors,
                                                                    setCheckingDuplicate,
                                                                );
                                                            }}
                                                            placeholder="Purchase link"
                                                            className={`w-full pr-9 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                                                                errors[deal.id]?.purchaseLink
                                                                    ? 'border-red-500'
                                                                    : 'border-gray-300'
                                                            }`}
                                                        />

                                                        {/* Loading icon */}
                                                        {checkingDuplicate[deal.id]?.purchaseLink && (
                                                            <span className="absolute inset-y-0 right-2 flex items-center">
                                                                <svg
                                                                    className="animate-spin h-4 w-4 text-gray-500"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    />
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {errors[deal.id]?.purchaseLink && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].purchaseLink}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Description */}
                                                <td className="px-4 py-3">
                                                    <div
                                                        onClick={() => openDescriptionEditor(deal.id)}
                                                        className={`w-full px-3 py-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors text-sm min-h-15 flex items-center justify-between ${
                                                            errors[deal.id]?.description
                                                                ? 'border-red-500'
                                                                : 'border-gray-300'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`flex-1 line-clamp-2 ${deal.description ? 'text-gray-700' : 'text-gray-400'}`}
                                                        >
                                                            {deal.description
                                                                ? stripHtmlTags(deal.description)
                                                                : 'Click to add description...'}
                                                        </span>
                                                        <Edit size={16} className="text-gray-400 ml-2 shrink-0" />
                                                    </div>
                                                    {errors[deal.id]?.description && (
                                                        <span className="text-xs text-red-500 block mt-1">
                                                            {errors[deal.id].description}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    <div className="block">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-semibold mb-1">
                                                                Trending Deals
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={deal.hotTrend}
                                                                onChange={(e) =>
                                                                    updateDeal(deal.id, 'hotTrend', e.target.checked)
                                                                }
                                                                className="w-5 h-5 accent-blue-600"
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-semibold mb-1">
                                                                Holiday Deals
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={deal.holidayDeals}
                                                                onChange={(e) =>
                                                                    updateDeal(
                                                                        deal.id,
                                                                        'holidayDeals',
                                                                        e.target.checked,
                                                                    )
                                                                }
                                                                className="w-5 h-5 accent-green-600"
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-semibold mb-1">
                                                                Seasonal Deals
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={deal.seasonalDeals}
                                                                onChange={(e) =>
                                                                    updateDeal(
                                                                        deal.id,
                                                                        'seasonalDeals',
                                                                        e.target.checked,
                                                                    )
                                                                }
                                                                className="w-5 h-5 accent-green-600"
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-semibold mb-1">Coupon</span>
                                                            <input
                                                                type="checkbox"
                                                                checked={deal.coupon}
                                                                onChange={(e) =>
                                                                    updateDeal(deal.id, 'coupon', e.target.checked)
                                                                }
                                                                className="w-5 h-5 accent-purple-600"
                                                            />
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-semibold mb-1">
                                                                Clearance
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={deal.clearance}
                                                                onChange={(e) =>
                                                                    updateDeal(deal.id, 'clearance', e.target.checked)
                                                                }
                                                                className="w-5 h-5 accent-red-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Action */}
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => deleteRow(deal.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                                                        title="Delete deal"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
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
