type DealLabelProps = {
    flashDeal?: boolean;
    coupon?: boolean;
    clearance?: boolean;
    daysRemaining?: number | null;
};

export default function DealLabel({
    flashDeal = false,
    coupon = false,
    clearance = false,
    daysRemaining = null,
}: DealLabelProps) {
    let label: string | null = null;
    let colorClasses = '';

    if (flashDeal) {
        label = 'Flash Deal';
        colorClasses = 'bg-purple-100 text-purple-700';
    } else if (coupon) {
        label = 'Coupon';
        colorClasses = 'bg-blue-100 text-blue-700';
    } else if (clearance) {
        label = 'Clearance';
        colorClasses = 'bg-red-100 text-red-700';
    } else if (daysRemaining !== null) {
        if (daysRemaining > 0) {
            label = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`;
            colorClasses = 'bg-green-100 text-green-700';
        } else {
            label = 'Expires today';
            colorClasses = 'bg-orange-100 text-orange-700';
        }
    }

    if (!label) return null;

    return (
        <span
            className={`absolute top-0 right-0 inline-flex items-center px-2 text-xs font-semibold ${colorClasses}`}
            aria-label={label}
        >
            {label}
        </span>
    );
}
