import { getErrorMessage } from '@/utils/errorHandler';
import { fetcher, fetcherWithAuth } from '@/utils/utils';

type AddCommentPayload = {
    dealId: string;
    content: string;
    parentId?: string | null;
    user?: {
        _id?: string;
        name?: string;
        email?: string;
    } | null;
    guestName?: string;
    guestEmail?: string;
};

export async function addComment({ dealId, content, parentId = null, user, guestName, guestEmail }: AddCommentPayload) {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/comment/add-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deal: dealId,
                parentId,
                content,
                user: user?._id ?? null,
                username: user?.name ?? guestName,
                userEmail: user?.email ?? guestEmail,
            }),
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function likeCommentAsGuest(commentId: string) {
    try {
        const data = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/comment/${commentId}/like`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}

export async function likeCommentAsUser(commentId: string, userId: string) {
    try {
        const data = await fetcherWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/comment/${commentId}/like`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error: unknown) {
        return {
            success: false,
            message: getErrorMessage(error),
        };
    }
}
