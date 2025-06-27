
// Types for PocketBase data
export interface PBOrder {
     id: string;
     customer_id: string;
     customer_name: string;
     phone_number: string;
     address_id: string;
     address: string;
     status: 'pending' | 'delivered' | 'cancelled';
     reference_id: string;
     remark: string;
     created: string;
     updated: string;
}

export interface PBOrderItem {
     id: string;
     order_id: string;
     product_id: string;
     quantity: number;
     price_lak: number;
     price_usd: number;
     price_thb: number;
     product_name: string;
     created: string;
     updated: string;
}

export interface PBCustomer {
     id: string;
     username: string;
     name: string;
     phone_number: string;
     avatar: string;
     verified: boolean;
     email: string;
     emailVisibility: boolean;
     address_id: string;
     created: string;
     updated: string;
}

export interface PBAddress {
     id: string;
     customer_id: string;
     province_id: string;
     district_id: string;
     village: string;
     shipping_name: string;
     created: string;
     updated: string;
}

export interface PBProduct {
     id: string;
     name: string;
     description: string;
     price_lak: number;
     price_usd: number;
     price_thb: number;
     category_id: string;
     images: Array<string>;
     created: string;
     updated: string;
}
   