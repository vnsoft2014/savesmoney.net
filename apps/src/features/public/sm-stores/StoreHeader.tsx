import { Card, CardContent } from '@/shared/shadecn/ui/card';
import Image from 'next/image';

type Props = {
    logo: string;
    name: string;
    description: string;
};

const StoreHeader = ({ logo, name, description }: Props) => {
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
                </div>
            </CardContent>
        </Card>
    );
};

export default StoreHeader;
