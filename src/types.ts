import * as DataGenerator from 'data-generator-retail';

export type ThemeName = 'light' | 'dark';

export type Category = DataGenerator.Category;
export type Product = DataGenerator.Product;
export type Customer = DataGenerator.Customer;
export type Order = DataGenerator.Order;
export type Invoice = DataGenerator.Invoice;
export type Review = DataGenerator.Review;
export type BasketItem = DataGenerator.BasketItem;

export interface ApiOrder {
    id: string;
    referenceID: string;
    customerID: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    status: 'pending' | 'delivered' | 'cancelled';
    quantity: number;
    amountLAK: string;
    amountTHB: string;
    amountUSD: string;
    created: string;
    updated: string;
}

export interface ApiOrderResponse {
    items: ApiOrder[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
}

export type Currency = 'USD' | 'LAK' | 'THB';

export interface ProductCategory {
    id: string;
    collectionId: string;
    collectionName: string;
    name: string;
    name_la: string;
    image_url: string;
    created: string;
    updated: string;
}

declare global {
    interface Window {
        restServer: any;
    }
}
