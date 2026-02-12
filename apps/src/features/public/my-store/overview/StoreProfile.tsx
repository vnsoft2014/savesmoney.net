import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { ExternalLink, Settings, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    store: any;
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
                        <div>
                            <Image
                                src={store.logo || '/image.png'}
                                alt={store.name}
                                width={160}
                                height={160}
                                className="w-24 h-24 lg:w-40 lg:h-40 rounded object-cover border shadow-sm"
                            />
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{store.name}</h1>

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

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
