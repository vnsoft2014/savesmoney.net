export const getDateRangeFromToday = (daysLater: number) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysLater);

    return {
        startDate: today.toISOString().split('T')[0],
        endDate: targetDate.toISOString().split('T')[0],
    };
};

export const getDaysRemaining = (expireDate: string | null) => {
    if (expireDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expire = new Date(expireDate);
        expire.setHours(0, 0, 0, 0);

        const diffTime = expire.getTime() - today.getTime();

        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    } else {
        return null;
    }
};

export const getDaysExpired = (expireDate: string | Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expire = new Date(expireDate);
    expire.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - expire.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

export const formatPrice = (price?: number | string): string | null => {
    if (price === undefined || price === null || price === '') return null;

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    if (typeof price === 'number') {
        return formatter.format(price);
    }

    const normalized = price.trim();

    if (normalized.includes('$') || normalized.toUpperCase().includes('USD')) {
        return normalized;
    }

    const num = parseFloat(normalized.replace(/[^\d.-]/g, ''));

    if (!isNaN(num)) {
        return formatter.format(num);
    }

    return null;
};

export function truncateDescription(text: string, maxLength = 160): string {
    if (!text) return '';

    const clean = text.replace(/\s+/g, ' ').trim();

    if (clean.length <= maxLength) return clean;

    return clean.slice(0, maxLength - 3).trimEnd() + '...';
}
