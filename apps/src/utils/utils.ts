import { MESSAGES } from '@/constants/messages';
import { getSession } from 'next-auth/react';

// Function to format a number in thousands (K) or millions (M) format depending on its value
export const getSuffixNumber = (number: number, digits: number = 1): string => {
    const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'K' },
        { value: 1e6, symbol: 'M' },
        { value: 1e9, symbol: 'G' },
        { value: 1e12, symbol: 'T' },
        { value: 1e15, symbol: 'P' },
        { value: 1e18, symbol: 'E' },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const lookupItem = lookup
        .slice()
        .reverse()
        .find((item) => number >= item.value);
    return lookupItem ? (number / lookupItem.value).toFixed(digits).replace(rx, '$1') + lookupItem.symbol : '0';
};

export const formatToSlashDate = (date: string) => {
    return date ? date.replace(/-/g, '/') : '';
};

export const formatToDashDate = (date: string) => {
    return date ? date.replace(/\//g, '-') : '';
};

export const formatDate = (dateString?: string) => {
    if (!dateString) return '-';

    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';

    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');

    return `${yyyy}/${mm}/${dd}`;
};

export const toDateInputValue = (iso?: string | null) => {
    if (!iso) return '';
    return iso.split('T')[0];
};

export const fetcher = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
        },
    });

    return res.json();
};

export const fetcherWithAuth = async (url: string, options: RequestInit = {}) => {
    const session = await getSession();

    if (!session?.accessToken) {
        throw new Error(MESSAGES.ERROR.UNAUTHORIZED);
    }

    const res = await fetch(url, {
        ...options,
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            ...(options.headers || {}),
        },
    });

    return res.json();
};

export const getTodayDateOnly = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const startOfDayUTC = (date: string): Date => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
};

export const endOfDayUTC = (date: string): Date => {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
};

export const stripHtmlTags = (html: string): string => {
    if (!html) return '';

    return html
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/\s+/g, ' ') // normalize spaces
        .trim();
};

export const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);

export const getIdFromSlug = (slug: string): string => {
    if (!slug) return '';

    const parts = slug.split('-');
    const id = parts[parts.length - 1];

    return isValidObjectId(id) ? id : '';
};

export const getInitials = (name: string) => {
    return (
        name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase() || 'U'
    );
};
