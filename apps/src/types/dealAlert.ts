export interface DealAlert {
    _id: string;
    user?: string | null;
    keywords: string[];
    channel: 'email';
    name: string;
    email: string;
    isActive: boolean;
    lastSentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type DealAlertPayload = {
    keywords: string[];
    channel: 'email';
    name: string;
    email: string;
    user: string | null;
};
