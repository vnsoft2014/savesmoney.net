import { PaginatedResponse } from '../../types/common';
import { User } from '../../types/user';
import { Coupon } from './coupon';
import { DealType } from './dealType';
import { Store } from './store';

export type DealFormValues = {
    id: number;
    picture: string | null;
    dealType: string[];
    store: string;
    expireAt: string | null;
    shortDescription: string;
    originalPrice: number;
    discountPrice: number;
    percentageOff: string;
    purchaseLink: string;
    description: string;
    flashDeal: boolean;
    flashDealExpireHours: number | null;
    tags: string[];
    hotTrend: boolean;
    holidayDeals: boolean;
    seasonalDeals: boolean;
    coupon: boolean;
    coupons: Coupon[];
    clearance: boolean;
    disableExpireAt: boolean;
    author: string;
};

export type Deal<TDealType = DealType, TStore = Store, TUser = User, TCoupon = Coupon> = {
    _id: string;
    image: string;
    dealType: TDealType[];
    store: TStore;
    expireAt: string | null;
    shortDescription: string;
    slug: string;
    originalPrice: number;
    discountPrice: number;
    percentageOff: string;
    purchaseLink: string;
    description: string;
    flashDeal: boolean;
    flashDealExpireHours?: number;
    tags?: string[];
    hotTrend: boolean;
    holidayDeals: boolean;
    seasonalDeals: boolean;
    coupon: boolean;
    coupons?: TCoupon[];
    clearance: boolean;
    disableExpireAt: boolean;
    author: TUser;
    status: 'pending' | 'published' | 'rejected';
    createdAt: string;
    updatedAt: string;
};

export type DealRaw = Deal<string, string, string, Coupon>;

export type DealFull = Deal<DealType, Store, User, Coupon>;

export type GetActiveDealsParams = {
    dealType?: string;
    dealStore?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortField?: 'createdAt' | 'expiredAt' | 'originalPrice' | 'discountPrice';
    sortOrder?: 'asc' | 'desc';
    hotTrend?: boolean;
    holidayDeals?: boolean;
    seasonalDeals?: boolean;
    expireAt?: 'null';
    author?: string;
    status?: 'pending' | 'published' | 'rejected';
    userStore?: string;
};

export type DealListResponse = PaginatedResponse<DealFull>;
