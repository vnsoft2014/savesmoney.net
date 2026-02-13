'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { UserStore } from '@/shared/types';
import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

interface Props {
    store: UserStore;
}

const StoreCard = memo(({ store }: Props) => {
    return (
        <Link key={store._id} href={`/sm-stores/${store.slug}-${store._id}`} className="group">
            <Card className="h-full p-4 transition-all duration-300 shadow-2xs hover:shadow-sm border-muted">
                <CardHeader className="flex flex-col items-center text-center">
                    <Image
                        src={store.logo || '/image.png'}
                        alt={store.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-2xl border bg-muted"
                    />
                </CardHeader>

                <CardContent className="mt-4 text-center space-y-1">
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition">
                        {store.name}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                        {store.slug}-{store._id}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
});

StoreCard.displayName = 'UserStoreCard';

export default StoreCard;
