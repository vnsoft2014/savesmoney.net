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
import { AddDealForm as AddDealFormType, addDealSchema } from '@/features/common/schemas/Deal.schema';
import { MyStoreGuestBanner } from '@/features/public/my-store';
import { useAuth } from '@/hooks/useAuth';
import { buildFormData } from '@/lib/buildFormData';
import { Button } from '@/shared/shadecn/ui/button';
import { FieldGroup } from '@/shared/shadecn/ui/field';
import { Form } from '@/shared/shadecn/ui/form';
import { toast } from 'react-toastify';
import { addDeal } from '../services';
import { DuplicateInput } from './components';

export default function AddDeal() {
    const { isSignin } = useAuth();

    const router = useRouter();

    const form = useForm<AddDealFormType>({
        resolver: zodResolver(addDealSchema),
        defaultValues: {
            picture: undefined,
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

    const onSubmit = async (values: AddDealFormType) => {
        const fd = buildFormData(values);
        const res = await addDeal(fd);
        if (res.success) {
            toast.success(res.message);
            router.push('/my-store');
        } else {
            toast.error(res.message);
        }
    };

    if (!isSignin) return <MyStoreGuestBanner />;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <PictureUploadField />

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
                        </FieldGroup>
                    </form>
                </Form>
            </div>
        </div>
    );
}
