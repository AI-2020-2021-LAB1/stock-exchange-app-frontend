// Generated by https://quicktype.io

export interface Orders {
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
    amount: number;
    remainingAmount: number;
    orderType: OrderType;
    priceType: PriceType;
    price: number;
    dateCreation: string;
    dateExpiration: string;
    stock: Stock;
    dateClosing?: string;
}

export enum OrderType {
    BuyingOrder = 'BUYING_ORDER',
    SellingOrder = 'SELLING_ORDER',
}

export enum PriceType {
    Equal = 'EQUAL',
    GreaterOrEqual = 'GREATER_OR_EQUAL',
    LessOrEqual = 'LESS_OR_EQUAL',
}

export interface Stock {
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
