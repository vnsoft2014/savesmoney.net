import { Badge } from '@/shared/shadecn/ui/badge';
import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { UserStore } from '@/shared/types';
import { AlertCircle, CheckCircle, ExternalLink, Settings, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    store: UserStore;
};

export default function StoreProfile({ store }: Props) {
    const revenue = store.totalRevenue || 0;

    const formattedRevenue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(revenue);

    return (
        <div className="container px-3">
            <Card className="relative shadow-2xs bg-white">
                <div className="absolute top-5 right-5">
                    <Link href="/my-store/settings" prefetch={false}>
                        <Button size="icon" variant="ghost" className="rounded-xl">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </Button>
                    </Link>
                </div>

                <CardContent className="p-4 lg:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="text-center">
                            <Image
                                src={store.logo || '/image.png'}
                                alt={store.name}
                                width={160}
                                height={160}
                                className="w-44 h-44 lg:w-60 lg:h-60 mx-auto rounded object-cover border shadow-sm"
                            />
                            <div className="flex flex-wrap justify-center gap-3 mx-auto pt-6">
                                <Button variant="outline" className="rounded-xl" asChild>
                                    <Link
                                        href={`/sm-stores/${store.slug}-${store._id}`}
                                        prefetch={false}
                                        className="inline-flex items-center"
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        View Live Store
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <h1 className="mb-0! text-2xl lg:text-3xl font-sans-condensed font-bold tracking-tight">
                                        {store.name}
                                    </h1>

                                    <Badge
                                        variant={store.isActive ? 'default' : 'destructive'}
                                        className="rounded-lg px-3 py-1 text-xs text-white"
                                    >
                                        {store.isActive ? (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Inactive
                                            </span>
                                        )}
                                    </Badge>
                                </div>

                                <p className="text-muted-foreground mt-2 max-w-xl text-sm">
                                    {store.description || 'No description provided for this store.'}
                                </p>

                                {store.website && (
                                    <div className="mt-3">
                                        <a
                                            href={store.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span className="line-clamp-1">{store.website}</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 bg-muted/50 rounded-2xl p-4 w-fit mx-auto md:mx-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        Total Revenue
                                    </p>
                                    <p className="text-lg font-semibold">{formattedRevenue}</p>
                                </div>
                            </div>

                            {!store.isActive && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl border border-red-200">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm">
                                        This store is inactive. Adding new deals is currently disabled.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
