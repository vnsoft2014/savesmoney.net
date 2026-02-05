import { USER_ROLES } from '@/constants/user';

export type UserRole = (typeof USER_ROLES)[number];

export type User = {
    _id: string;
    email: string;
    role: UserRole;
    name: string;
    avatar: string;
    passwordString: string;
    isBlocked: boolean;
    blockReason?: string;
    createdAt: string;
    updatedAt: string;
};
