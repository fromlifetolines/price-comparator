import React from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
}

const PLATFORM_COLORS: Record<string, string> = {
    'Yahoo': 'bg-purple-600',
    'PChome': 'bg-red-600',
    'MOMO': 'bg-pink-500',
    'Shopee': 'bg-orange-500',
    'Coupang': 'bg-red-500',
    'Unknown': 'bg-gray-500'
};

const PLATFORM_DISPLAY_NAMES: Record<string, string> = {
    'Yahoo': 'Yahoo購物',
    'PChome': 'PChome',
    'MOMO': 'MOMO購物',
    'Shopee': '蝦皮',
    'Coupang': '酷澎',
    'Unknown': '其他平台'
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { t, locale } = useLanguage();

    // Find the cheapest link
    const cheapestLink = product.links.reduce((prev, curr) => {
        return (prev.current_price < curr.current_price) ? prev : curr;
    }, product.links[0]);

    const cheapestPrice = cheapestLink ? cheapestLink.current_price : 0;
    const currencySymbol = t('currency');

    // Determine display label
    const platformLabel = cheapestLink ? (PLATFORM_DISPLAY_NAMES[cheapestLink.platform_name] || cheapestLink.platform_name) : '相關商品';

    return (
        <div className="bento-card group flex flex-col h-full hover:ring-2 hover:ring-blue-500/50 transition-all">
            {/* Image Container */}
            <div className="relative aspect-square w-full p-6 bg-white flex items-center justify-center overflow-hidden rounded-t-2xl">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out" />
                ) : (
                    <div className="text-gray-300 font-bold text-4xl select-none">IMG</div>
                )}

                {/* Platform Badges (Top Right) */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {Array.from(new Set(product.links.map(l => l.platform_name))).map((platformName) => (
                        <span key={platformName}
                            className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold shadow-sm ${PLATFORM_COLORS[platformName] || 'bg-gray-500'} opacity-90`}>
                            {platformName}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 bg-[#1c1c1e]">
                <div className="text-[10px] text-blue-400 mb-1 font-bold tracking-widest uppercase truncate">
                    {platformLabel}
                </div>
                <h3 className="font-medium text-base mb-3 line-clamp-2 leading-snug text-gray-100 flex-1" title={product.name}>
                    {product.name}
                </h3>

                <div className="mt-auto pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs text-gray-400">{t('lowestPrice')}</span>
                                {cheapestLink && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${PLATFORM_COLORS[cheapestLink.platform_name] || 'bg-gray-500'}`}>
                                        {cheapestLink.platform_name}
                                    </span>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-white tracking-tight">
                                <span className="text-sm font-normal text-gray-400 mr-1">{currencySymbol}</span>
                                {cheapestPrice.toLocaleString()}
                            </p>
                        </div>
                        <a href={cheapestLink?.url || '#'} target="_blank" rel="noopener noreferrer"
                            className="liquid-button rounded-full px-5 py-2 text-xs font-bold tracking-wider uppercase bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all text-white border-none">
                            GO
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
