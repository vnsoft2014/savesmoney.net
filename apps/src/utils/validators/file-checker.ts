import { MESSAGES } from '@/constants/messages';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/constants/upload';

export interface FileValidationResult {
    isValid: boolean;
    message: string;
}

type FileCheckConfig = {
    maxSize?: number;
    allowedTypes?: readonly string[];
};

export function checkFile(file: File | null, config: FileCheckConfig = {}): FileValidationResult {
    const { maxSize = MAX_IMAGE_SIZE, allowedTypes = ALLOWED_IMAGE_TYPES } = config;

    if (!file) {
        return { isValid: false, message: MESSAGES.FILE.NO_FILE };
    }

    if (!allowedTypes.includes(file.type)) {
        const readableTypes = allowedTypes.map((type) => type.split('/')[1].toUpperCase()).join(', ');

        return {
            isValid: false,
            message: MESSAGES.FILE.INVALID_TYPE(readableTypes),
        };
    }

    if (file.size > maxSize) {
        const maxSizeMB = Math.ceil(maxSize / (1024 * 1024));

        return {
            isValid: false,
            message: MESSAGES.FILE.SIZE_EXCEEDED(maxSizeMB),
        };
    }

    return { isValid: true, message: MESSAGES.FILE.VALID };
}
