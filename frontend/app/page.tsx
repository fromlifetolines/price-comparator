'use client';

import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function Home() {
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
      alert("Search failed or backend not running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <header className="glass-panel sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold tracking-tight">Price<span className="text-blue-600">Comp</span></h1>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition">Home</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition">Trending</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition">History</a></li>
              <li><button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full hover:opacity-90 transition">Login</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 blur-[120px] rounded-full mix-blend-screen"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide mb-6 border border-blue-100 dark:border-blue-800">
              SMART SHOPPING ASSISTANT
            </span>
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight tight-leading">
              Compare Prices. <br />
              <span className="gradient-text">Save Money.</span>
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Instantly search across Yahoo, PChome, MOMO, Shopee, and Coupang to find the absolute best deals in real-time.
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative flex bg-white dark:bg-zinc-900 rounded-xl p-2 shadow-2xl items-center border border-zinc-100 dark:border-zinc-800">
                <svg className="w-6 h-6 text-zinc-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input
                  type="text"
                  placeholder="What are you looking for today? (e.g. iPhone 15)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-4 bg-transparent focus:outline-none text-lg placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Scraping...
                    </span>
                  ) : 'Search'}
                </button>
              </div>
              <div className="flex gap-4 justify-center mt-6 text-sm text-zinc-500">
                <span>Trusted by 10k+ users</span>
                <span>•</span>
                <span>Real-time Data</span>
                <span>•</span>
                <span>5 Platforms</span>
              </div>
            </form>
          </div>
        </section>

        {/* Results Section */}
        <section className="container mx-auto px-4 pb-20">
          {products.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold">Search Results</h3>
                <div className="flex gap-2">
                  <select className="bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1 text-sm">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p, i) => (
                  <ProductCard key={i} product={p} />
                ))}
              </div>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-20 border-t border-zinc-100 dark:border-zinc-900">
              <h4 className="text-lg font-medium text-zinc-400 mb-2">Supported Platforms</h4>
              <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="font-bold text-xl text-purple-600">Yahoo!</span>
                <span className="font-bold text-xl text-red-500">PChome</span>
                <span className="font-bold text-xl text-pink-500">MOMO</span>
                <span className="font-bold text-xl text-orange-500">Shopee</span>
                <span className="font-bold text-xl text-red-600">Coupang</span>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
