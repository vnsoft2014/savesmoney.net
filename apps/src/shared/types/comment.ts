export type Comment = {
    _id: string;
    username: string;
    content: string;
    likes: number;
    likedBy: string[];
    createdAt: string;
    parentId: string;
    isApproved: boolean;
    deal: {
        _id: string;
        shortDescription: string;
    };
    user: {
        _id: string;
        name: string;
        avatar: string;
    } | null;

    repliesCount: number;

    replies?: Comment[];
    repliesPage?: number;
    repliesHasMore?: boolean;
    loadingReplies?: boolean;
};
