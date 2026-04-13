export type HeadlinePosition = 'left' | 'center' | 'right';

export interface HeadlineHeader {
    title?: string;
    subtitle?: React.ReactNode;
    tagline?: string;
    position?: HeadlinePosition;
}

export interface HeadlineProps {
    header: HeadlineHeader;
    containerClass?: string;
    titleClass?: string;
    subtitleClass?: string;
}

export interface ContactInput {
    type: 'text' | 'email' | 'tel' | 'number' | 'password';
    label?: string;
    name: string;
    placeholder?: string;
    autocomplete?: 'on' | 'off';
    required?: boolean;
}

export interface ContactRadio {
    label: string;
    value?: string;
}

export interface ContactTextarea {
    cols?: number;
    rows?: number;
    label?: string;
    name: string;
    placeholder?: string;
    required?: boolean;
}

export interface ContactCheckbox {
    label: string;
    value: string;
    checked?: boolean;
}

export interface ContactButton {
    title: string;
    type?: 'submit' | 'button' | 'reset';
}

export interface ContactProps {
    id: string;
    hasBackground?: boolean;

    header: HeadlineHeader;

    form: FormProps;
}

export interface FormProps {
    title?: string;
    description?: string;
    containerClass?: string;
    inputs?: ContactInput[];
    radioBtns?: {
        label?: string;
        radios: ContactRadio[];
    };
    textarea?: ContactTextarea;
    checkboxes?: ContactCheckbox[];
    btn?: ContactButton;
    btnPosition?: 'left' | 'center' | 'right';
}

export interface PropsWithPage {
    params: Promise<{ page: string }>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}
