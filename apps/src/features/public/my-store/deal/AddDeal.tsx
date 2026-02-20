'use client';

import { useRouter } from 'next/navigation';

import 'react-quill-new/dist/quill.snow.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    CouponsInput,
    DealDescription,
    DealFlags,
    DealTypeSelect,
    ExpiredDateField,
    FlashDealInput,
    PictureUploadField,
    PriceFields,
    StoreSelect,
    TagsInput,
} from '@/features/common/deal/edit-form';
import { DealForm as DealFormType, dealSchema } from '@/features/common/schemas/Deal.schema';
import { MyStoreGuestBanner } from '@/features/public/my-store';
import { addDeal } from '@/features/public/my-store/services';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/shadecn/ui/button';
import { Form } from '@/shared/shadecn/ui/form';
import { toast } from 'react-toastify';
import { DuplicateInput } from './components';

export default function AddDeal() {
    const { isSignin } = useAuth();

    const router = useRouter();

    const form = useForm<DealFormType>({
        resolver: zodResolver(dealSchema),
        shouldFocusError: true,
        defaultValues: {
            picture: '',
            dealType: [],
            store: '',
            expiredDate: '',
            disableExpireAt: false,
            coupon: false,
            coupons: [],
            clearance: false,
            shortDescription: '',
            originalPrice: 0,
            discountPrice: 0,
            percentageOff: '',
            purchaseLink: '',
            description: '',
            flashDeal: false,
            flashDealExpireHours: 0,
            tags: [],
            hotTrend: false,
            holidayDeals: false,
            seasonalDeals: false,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: DealFormType) => {
        const res = await addDeal(values);

        if (res.success) {
            toast.success(res.message);
            router.push('/my-store/deals');
        } else {
            toast.error(res.message);
        }
    };

    if (!isSignin) return <MyStoreGuestBanner />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <PictureUploadField name="picture" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DealTypeSelect />
                            <StoreSelect />
                        </div>

                        <ExpiredDateField />

                        <DuplicateInput name="shortDescription" label="Short Description" />
                        <PriceFields />
                        <DuplicateInput name="purchaseLink" label="Purchase Link" />
                        <TagsInput />
                        <DealFlags />

                        <FlashDealInput />
                        <CouponsInput />

                        <DealDescription />

                        <div className="col-span-full flex justify-end gap-3 mt-20">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
