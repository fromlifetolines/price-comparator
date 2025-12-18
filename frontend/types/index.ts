export interface Product {
    id?: number;
    name: string;
    description?: string;
    image_url?: string;
    category?: string;
    links: ProductLink[];
    price?: string; // For display
}

export interface ProductLink {
    platform_name: 'Yahoo' | 'PChome' | 'MOMO' | 'Shopee' | 'Coupang';
    url: string;
    current_price: number;
}
