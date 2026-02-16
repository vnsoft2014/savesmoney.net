export const MESSAGES = {
    ERROR: {
        INTERNAL_SERVER: 'Internal server error. Please try again later.',
        VALIDATION: 'Validation failed. Please check your input.',
        UNAUTHORIZED: 'You are not authorized to perform this action.',
        NOT_FOUND: 'The requested resource was not found.',
        FORBIDDEN: 'Permission denied.',
        NETWORK: 'Network error. Please check your connection.',
        TIMEOUT: 'Request timed out.',
    },

    WARNING: {
        RATE_LIMIT: 'Too many requests. Please try again later.',
        INVALID_FILE_TYPE: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.',
        FILE_SIZE_EXCEEDED: 'File size too large. Maximum 5MB allowed.',
    },

    SUCCESS: {
        CREATED: 'Created successfully!',
        UPDATED: 'Updated successfully!',
        DELETED: 'Deleted successfully!',
        FETCHED: 'Data loaded successfully.',
        ACTION: 'Action completed successfully.',
    },
    FILE: {
        NO_FILE: 'Please select a file.',
        INVALID_TYPE: (types: string) => `Invalid file type. Only ${types} are allowed.`,
        SIZE_EXCEEDED: (maxMB: number) => `File size too large. Maximum ${maxMB}MB allowed.`,
        VALID: 'File is valid.',
    },
    AUTH: {
        USER_ALREADY_EXIST: 'User Already Exist.',
        ACCOUNT_CREATED: 'Account created successfully.',
    },
} as const;
