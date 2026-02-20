'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import 'react-quill-new/dist/quill.snow.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    CouponsInput,
    DealDescription,
    DealFlags,
    DealTypeSelect,
    DuplicateInput,
    ExpiredDateField,
    FlashDealInput,
    PictureUploadField,
    PriceFields,
    StoreSelect,
    TagsInput,
} from '@/features/common/deal/edit-form';
import { updateDeal } from '@/services/admin/deal';
import { Button } from '@/shared/shadecn/ui/button';
import { Form } from '@/shared/shadecn/ui/form';
import { DealRaw } from '@/shared/types';
import { toast } from 'react-toastify';
import { DealForm as DealFormType, dealSchema } from '../../common/schemas/Deal.schema';

interface Props {
    deal: DealRaw;
}

export default function EditDealForm({ deal }: Props) {
    const router = useRouter();

    const form = useForm<DealFormType>({
        resolver: zodResolver(dealSchema),
        shouldFocusError: true,
        defaultValues: {
            picture: deal.image,
            dealType: deal.dealType,
            store: deal.store,
            expiredDate: deal.expireAt,
            disableExpireAt: deal.disableExpireAt,
            coupon: deal.coupon,
            coupons: deal.coupons ?? [],
            clearance: deal.clearance,
            shortDescription: deal.shortDescription,
            originalPrice: deal.originalPrice,
            discountPrice: deal.discountPrice,
            percentageOff: deal.percentageOff,
            purchaseLink: deal.purchaseLink,
            description: deal.description,

            flashDeal: deal.flashDeal,
            flashDealExpireHours: deal.flashDealExpireHours,
            tags: deal.tags ?? [],
            hotTrend: deal.hotTrend,
            holidayDeals: deal.holidayDeals,
            seasonalDeals: deal.seasonalDeals,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: DealFormType) => {
        const res = await updateDeal(deal._id, { _id: deal._id, ...values });

        if (res.success) {
            toast.success(res.message);
            router.push('/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Deal</h1>
                </div>

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
