'use client';

import { DealRaw } from '@/types';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

import 'react-quill-new/dist/quill.snow.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
    DealDescription,
    DealFlags,
    DealTypeSelect,
    DuplicateInput,
    ExpiredDateField,
    PictureUploadField,
    PriceFields,
    StoreSelect,
    TagsInput,
} from '@/features/common/deal/edit-form';
import { updateDeal } from '@/services/admin/deal';
import { Button } from '@/shared/shadecn/ui/button';
import { Form } from '@/shared/shadecn/ui/form';
import { toast } from 'react-toastify';
import { DealForm as DealFormType, dealSchema } from './schemas/Deal.schema';

interface Props {
    deal: DealRaw;
}

export default function EditDealForm({ deal }: Props) {
    const router = useRouter();

    const form = useForm<DealFormType>({
        resolver: zodResolver(dealSchema),
        defaultValues: {
            picture: deal.image,
            dealType: deal.dealType,
            store: deal.store,
            expiredDate: deal.expireAt,
            disableExpireAt: deal.disableExpireAt,
            coupon: deal.coupon,
            clearance: deal.clearance,
            shortDescription: deal.shortDescription,
            originalPrice: deal.originalPrice,
            discountPrice: deal.discountPrice,
            percentageOff: deal.percentageOff,
            purchaseLink: deal.purchaseLink,
            description: deal.description,
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
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                            <ArrowLeft />
                        </Button>

                        <h1 className="text-3xl font-bold text-gray-800">Update Deal</h1>
                    </div>

                    <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        <Save className="mr-2" />
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </Button>
                </div>

                <Form {...form}>
                    <form className="space-y-6">
                        <PictureUploadField name="picture" />
                        <DealTypeSelect />
                        <StoreSelect />
                        <ExpiredDateField />
                        <DuplicateInput name="shortDescription" label="Short Description" />
                        <PriceFields />
                        <DuplicateInput name="purchaseLink" label="Purchase Link" />
                        <TagsInput />
                        <DealFlags />
                        <DealDescription />
                    </form>
                </Form>
            </div>
        </div>
    );
}
