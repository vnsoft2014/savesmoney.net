'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    logo: string;
    name: string;
    description: string;
    author: string;
};

const StoreHeader = ({ logo, name, description, author }: Props) => {
    const { user, isSignin } = useAuth();

    const isAuthor = isSignin && user?._id === author;

    return (
        <Card className="relative mb-4 md:mb-6 bg-white border border-gray-100 shadow-xs">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="text-center">
                        <Image
                            src={logo || '/image.png'}
                            alt={name}
                            width={160}
                            height={160}
                            className="w-28 h-28 lg:w-30 lg:h-30 mx-auto rounded object-cover border shadow-sm"
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-6">
                        <h1 className="mb-0! text-2xl lg:text-3xl font-sans-condensed font-bold tracking-tight">
                            {name}
                        </h1>

                        <p className="text-muted-foreground mt-2">
                            {description || 'No description provided for this store.'}
                        </p>
                    </div>

                    {isAuthor && (
                        <Link
                            href="/my-store"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition text-sm font-medium"
                        >
                            <Store size={18} />
                            My Store
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StoreHeader;
