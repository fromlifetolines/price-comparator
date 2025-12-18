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
    // TODO: Connect to backend API
    // const res = await fetch(`http://localhost:8000/search?q=${searchTerm}`);
    // const data = await res.json();

    // Mock data for user's requested "Display cheapest price" feature
    setTimeout(() => {
      setProducts([
        {
          name: `${searchTerm} (Mock Result)`,
          image_url: "https://dummyimage.com/300x300/000/fff&text=Product",
          links: [
            { platform_name: 'Yahoo', url: '#', current_price: 24900 },
            { platform_name: 'PChome', url: '#', current_price: 24500 },
            { platform_name: 'MOMO', url: '#', current_price: 24800 },
          ]
        },
        {
          name: `${searchTerm} Pro Max (Mock Result)`,
          image_url: "https://dummyimage.com/300x300/000/fff&text=Product",
          links: [
            { platform_name: 'Shopee', url: '#', current_price: 32000 },
            { platform_name: 'Coupang', url: '#', current_price: 31500 },
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="bg-white dark:bg-black shadow p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            PriceComp
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:text-blue-500">Home</a></li>
              <li><a href="#" className="hover:text-blue-500">History</a></li>
              <li><a href="#" className="hover:text-blue-500">Alerts</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Find the Best Prices Across Taiwan</h2>
          <p className="text-zinc-500 mb-8">Compare Yahoo, PChome, MOMO, Shopee, and Coupang instantly.</p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Search for products (e.g. iPhone 15)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </section>

        <section>
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ProductCard key={i} product={p} />
              ))}
            </div>
          )}
          {products.length === 0 && !loading && searchTerm && (
            <div className="text-center text-zinc-500 mt-12">
              No results found yet. Try searching!
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
