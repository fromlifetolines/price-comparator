import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t, locale } = useLanguage();
    // Find the cheapest price
    const cheapestPrice = product.links.length > 0
        ? Math.min(...product.links.map(l => l.current_price))
        : 0;

    const currencySymbol = t('currency');

    return (
        <div className="bento-card group flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-square w-full p-8 bg-white/5 flex items-center justify-center">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-contain w-full h-full drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                    <div className="text-gray-600 font-bold text-4xl select-none">IMG</div>
                )}
                {/* Platform Badges */}
                <div className="absolute bottom-3 right-3 flex -space-x-2">
                    {product.links.map((link, i) => (
                        <div key={link.platform_name} className="w-8 h-8 rounded-full bg-[#1d1d1f] border border-gray-700 flex items-center justify-center text-xs font-bold text-white shadow-lg z-10" title={link.platform_name}>
                            {link.platform_name[0]}
                        </div>
                    )).slice(0, 3)}
                    {product.links.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-[#1d1d1f] border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shadow-lg z-0">
                            +{product.links.length - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="text-[10px] text-blue-400 mb-2 font-bold tracking-widest uppercase">
                    {product.category || 'Product'}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 leading-snug text-gray-100 flex-1">
                    {product.name}
                </h3>

                <div className="pt-4 border-t border-white/10 mt-auto">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">{t('lowestPrice')}</p>
                            <p className="text-2xl font-bold text-white tracking-tight">
                                <span className="text-sm font-normal text-gray-400 align-top mr-0.5">{currencySymbol}</span>
                                {cheapestPrice.toLocaleString()}
                            </p>
                        </div>
                        <button className="liquid-button rounded-full px-6 py-2 text-xs font-bold tracking-wider uppercase hover:shadow-[0_0_20px_rgba(41,151,255,0.6)] border-white/20">
                            {t('viewProduct')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
