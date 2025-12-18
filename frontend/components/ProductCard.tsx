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
        <div className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image Container */}
            <div className="h-56 bg-zinc-50 dark:bg-zinc-950 p-6 flex items-center justify-center relative overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-contain h-full w-full group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="text-zinc-300 dark:text-zinc-700 font-bold text-4xl select-none">IMG</div>
                )}
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    Best Deal
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="text-xs text-blue-500 mb-2 font-medium tracking-wider uppercase">
                    {product.category || 'Electronics'}
                </div>
                <h3 className="font-bold text-lg mb-3 line-clamp-2 leading-tight text-zinc-900 dark:text-zinc-100 h-12">
                    {product.name}
                </h3>

                <div className="flex items-end justify-between mb-4">
                    <div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Lowest Price</span>
                        <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
                            ${cheapestPrice.toLocaleString()}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">Found on</span>
                        <div className="flex -space-x-2 justify-end">
                            {product.links.map((link, i) => (
                                <div key={link.platform_name} className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 border border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold z-0 relative" title={`${link.platform_name}: $${link.current_price}`}>
                                    {link.platform_name[0]}
                                </div>
                            )).slice(0, 4)}
                        </div>
                    </div>
                </div>

                {/* Detailed Price List Hover Reveal (Optional, keeping simple for now) */}
                <div className="space-y-1 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    {product.links.map(link => (
                        <div key={link.platform_name} className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
                            <span>{link.platform_name}</span>
                            <span className="font-mono">${link.current_price.toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <button className="w-full mt-4 bg-zinc-900 dark:bg-white text-white dark:text-black py-2.5 rounded-lg font-semibold hover:opacity-90 transition active:scale-95 text-sm">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
