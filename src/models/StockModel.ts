// Generated by https://quicktype.io

export interface Stocks {
    content: Content[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface Content {
    id: number;
    name: string;
    abbreviation: string;
    currentPrice: number;
    amount: number;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}