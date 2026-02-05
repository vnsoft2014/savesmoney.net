'use client';

import { useState } from 'react';
import { CommentForm, CommentList } from './components';

export default function CommentSection({ dealId }: { dealId: string }) {
    const [mutateComments, setMutateComments] = useState<(() => void) | null>(null);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
