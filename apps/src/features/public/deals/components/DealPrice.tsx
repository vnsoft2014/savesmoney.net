import { cn } from '@/lib/utils';
import { formatPrice } from '@/utils/deal';

interface DealPriceProps {
    originalPrice: number;
    discountPrice?: number;
    percentageOff?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

type DealPriceSize = NonNullable<DealPriceProps['size']>;

type SizeStyle = {
    gap: string;
    price: string;
    discount: string;
    badge: string;
};

const sizeMap: Record<DealPriceSize, SizeStyle> = {
    xs: {
        gap: 'gap-1',
        price: 'text-xs md:text-[13px]',
        discount: 'text-sm md:text-[15px]',
        badge: 'text-[9px] md:text-[11px] px-1.5 py-0.5',
    },
    sm: {
        gap: 'gap-2',
        price: 'text-sm',
        discount: 'text-base',
        badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
        gap: 'gap-2',
        price: 'text-sm md:text-md',
        discount: 'text-md md:text-lg',
        badge: 'text-[11px] md:text-xs px-2 py-0.5',
    },
    lg: {
        gap: 'gap-3',
        price: 'text-base md:text-lg',
        discount: 'text-lg md:text-2xl',
        badge: 'text-xs md:text-sm px-2.5 py-1',
    },
};

const DealPrice = ({ originalPrice, discountPrice, percentageOff, size = 'md' }: DealPriceProps) => {
    const styles = sizeMap[size];

    const hasDiscount = typeof discountPrice === 'number' && discountPrice > 0 && discountPrice < originalPrice;

    if (!hasDiscount) {
        return (
            <div className="min-h-7 mb-0">
                <span className={cn('font-semibold text-gray-800', styles.discount)}>{formatPrice(originalPrice)}</span>
            </div>
        );
    }

    return (
        <div className="min-h-7 mb-0">
            <div className={`flex items-center ${styles.gap}`}>
                <span className={cn('font-bold text-red-600', styles.discount)}>{formatPrice(discountPrice)}</span>

                <span className={cn('line-through text-gray-400', styles.price)}>{formatPrice(originalPrice)}</span>

                {percentageOff && (
                    <span className={cn('font-semibold text-green-600 bg-green-100 rounded', styles.badge)}>
                        {percentageOff}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DealPrice;
