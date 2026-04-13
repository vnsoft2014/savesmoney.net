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
import { EditDealForm as EditDealFormType, editDealSchema } from '@/features/common/schemas/Deal.schema';
import { buildFormData } from '@/lib/buildFormData';
import { Button } from '@/shared/shadecn/ui/button';
import { Form } from '@/shared/shadecn/ui/form';
import { DealRaw } from '@/types';
import { toast } from 'react-toastify';
import { updateDeal } from '../services';
import { DuplicateInput } from './components';

interface Props {
    deal: DealRaw;
}

export default function EditDeal({ deal }: Props) {
    const router = useRouter();

    const form = useForm<EditDealFormType>({
        resolver: zodResolver(editDealSchema),
        shouldFocusError: true,
        defaultValues: {
            picture: undefined,
            dealType: deal.dealType,
            store: deal.store,
            expiredDate: deal.expireAt,
            disableExpireAt: deal.disableExpireAt,
            coupon: deal.coupon,
            coupons: deal.coupons,
            clearance: deal.clearance,
            shortDescription: deal.shortDescription,
            originalPrice: deal.originalPrice,
            discountPrice: deal.discountPrice,
            percentageOff: deal.percentageOff,
            purchaseLink: deal.purchaseLink,
            description: deal.description,
            flashDeal: deal.flashDeal,
            flashDealExpireHours: deal.flashDealExpireHours,
            tags: deal.tags,
            hotTrend: deal.hotTrend,
            holidayDeals: deal.holidayDeals,
            seasonalDeals: deal.seasonalDeals,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: EditDealFormType) => {
        const fd = buildFormData(values);
        const res = await updateDeal(deal._id, fd);
        if (res.success) {
            toast.success(res.message);
            router.push('/my-store');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <PictureUploadField thumbnail={deal.image} />

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
