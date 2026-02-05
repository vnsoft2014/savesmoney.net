import { Skeleton } from '@/shared/shadecn/ui/skeleton';

export default function CommentSkeleton() {
    return (
        <div className="max-w-4xl mx-auto w-full space-y-8 py-8">
            <div className="flex justify-between items-center border-b pb-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-9 w-35" />
            </div>

            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
