import sanitizeHtml from 'sanitize-html';

export const cleanHtml = (dirty: string) => {
    return sanitizeHtml(dirty, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape',
    });
};
