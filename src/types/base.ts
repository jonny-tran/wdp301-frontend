export type ResponseData<T> = {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
    path: string;
};

export type ResponseError = {
    statusCode: number;
    message: string;
    error?: string;
    errors?: ValidationErrorItem[];
    timestamp?: string;
    path?: string;
};

export type ValidationErrorItem = {
    field: string;
    message: string;
};

export type PaginationMeta = {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};

export type BaseResponsePagination<T> = {
    items: T[];
    meta: PaginationMeta;
};

export type BaseRequestPagination = {
    page: number;
    limit: number;
    sortOrder: 'ASC' | 'DESC';
    sortBy?: string;
};
