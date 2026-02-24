import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';

export function stripHtml(value: string): string;
export function stripHtml(value: string[]): string[];
export function stripHtml(value: string | string[]) {
    if (!value) return value;

    const clean = (val: string) =>
        sanitizeHtml(val, {
            allowedTags: [],
            allowedAttributes: {},
            disallowedTagsMode: 'discard',
        }).trim();

    if (Array.isArray(value)) {
        return value.map(clean);
    }

    return clean(value);
}

export const sanitizeUrl = (value: string | null) => {
    if (!value) return '';

    const clean = stripHtml(value);

    try {
        const testVal = clean.startsWith('http') ? clean : `https://${clean}`;
        new URL(testVal);
        return clean;
    } catch {
        return '';
    }
};

export const sanitizeDescription = (dirty: string) => {
    return sanitizeHtml(dirty, {
        allowedTags: ['b', 'i', 'em', 'strong', 'u', 'p', 'br', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'h5', 'h6'],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
    }).trim();
};

export function generateUniqueSlug(name: string) {
    const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
    });

    return slug;
}
