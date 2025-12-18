import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Find the cheapest price
    const cheapestPrice = product.links.length > 0
        ? Math.min(...product.links.map(l => l.current_price))
        : 0;

    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-zinc-800">
            <div className="h-40 bg-zinc-100 rounded mb-4 overflow-hidden flex items-center justify-center">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-contain h-full w-full" />
                ) : (
                    <span className="text-zinc-400">No Image</span>
                )}
            </div>
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <div className="text-xl font-bold text-red-600 mb-2">
                ${cheapestPrice.toLocaleString()}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-600">
                {product.links.map(link => (
                    <span key={link.platform_name} className="px-2 py-1 bg-zinc-100 rounded">
                        {link.platform_name}: ${link.current_price}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ProductCard;
