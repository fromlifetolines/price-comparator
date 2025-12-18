"use client";

import { useLanguage } from "../context/LanguageContext";
import { Locale } from "../locales";

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocale(e.target.value as Locale);
    };

    return (
        <div className="relative">
            <div className="flex items-center gap-2 bg-[#1d1d1f] border border-white/10 rounded-full px-4 py-1.5 transition hover:bg-white/10">
                <span className="text-xs">🌐</span>
                <select
                    value={locale}
                    onChange={handleLanguageChange}
                    className="bg-transparent border-none text-sm text-gray-300 focus:ring-0 focus:outline-none cursor-pointer appearance-none pr-6 font-medium"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right center",
                        backgroundSize: "14px"
                    }}
                >
                    <option value="zh-TW" className="bg-[#1d1d1f] text-white">繁體中文</option>
                    <option value="en" className="bg-[#1d1d1f] text-white">English</option>
                    <option value="ja" className="bg-[#1d1d1f] text-white">日本語</option>
                </select>
            </div>
        </div>
    );
}
