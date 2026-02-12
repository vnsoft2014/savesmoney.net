'use client';

import { useState } from 'react';
import { CommentForm, CommentList } from './components';

export default function CommentSection({ dealId }: { dealId: string }) {
    const [mutateComments, setMutateComments] = useState<(() => void) | null>(null);

    return (
        <div className="mt-6 border-b">
            <CommentForm
                dealId={dealId}
                onSuccess={() => {
                    mutateComments?.();
                }}
            />

            <CommentList dealId={dealId} onReady={(mutate) => setMutateComments(() => mutate)} />
        </div>
    );
}
