'use client';

import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import FluidBackground from '../components/FluidBackground';

export default function Home() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setProducts([]);

    try {
      const res = await fetch(`http://localhost:8000/search?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert(t('noResults'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500 selection:text-white">
      <FluidBackground />

      {/* Navbar */}
      <header className="glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500 text-white font-bold text-xl">P</div>
            <h1 className="text-xl font-semibold tracking-tight">Price<span className="text-blue-500">Comp</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:block">
              <ul className="flex space-x-8 text-sm font-medium text-gray-300">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Trending</a></li>
                <li><a href="#" className="hover:text-white transition">History</a></li>
              </ul>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center px-4">
          <div className="animate-fade-in max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide mb-6 border border-blue-500/20 uppercase">
              {t('title')}
            </span>
            <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-none">
              {t('subtitle')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              {t('description')}
            </p>

            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full apple-input rounded-full py-4 pl-6 pr-32 text-lg backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 apple-button rounded-full px-6 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : t('searchButton')}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-4 pb-32">
          {products.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold tracking-tight">Results</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-6 uppercase tracking-widest text-xs">{t('platform')}</p>
              <div className="flex justify-center flex-wrap gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                <span className="font-bold text-2xl text-purple-400">Yahoo!</span>
                <span className="font-bold text-2xl text-red-400">PChome</span>
                <span className="font-bold text-2xl text-pink-400">MOMO</span>
                <span className="font-bold text-2xl text-orange-400">Shopee</span>
                <span className="font-bold text-2xl text-red-500">Coupang</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
