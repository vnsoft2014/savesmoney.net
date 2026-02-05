import { fetcher } from '@/utils/utils';

const getCommentCount = async (dealId: string) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/common/comment/count-comments?dealId=${dealId}`,
        );
        const data = await res.json();
        if (data.success) return data.count;
        return 0;
    } catch (err) {
        console.error(err);
        return 0;
    }
};

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
    const data = await fetcher('/api/common/comment/add-comment', {
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
}
