import { PaginatedResponse, User } from '@/types';

export interface UserStore {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    website?: string;
    description?: string;
    author: User;
    isActive: boolean;
    totalRevenue: number;
    createdAt: Date;
    updatedAt: Date;
}

export type UserStoreListResponse = PaginatedResponse<UserStore>;
