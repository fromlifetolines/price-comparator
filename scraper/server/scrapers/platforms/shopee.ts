import axios from 'axios';

export async function ShopeeScraper(keyword: string) {
    console.log(`[Shopee] Starting scrape for ${keyword} (Light Mode)`);
    try {
        // Shopee API V4 (Note: This often requires specific headers/signatures. 
        // We attempt a basic fetch with browser-like headers. If 403, we return empty.)
        const url = `https://shopee.tw/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(keyword)}&limit=60&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;
        console.log(`[Shopee] Fetching API: ${url}`);

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://shopee.tw/search?keyword=' + encodeURIComponent(keyword),
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const items = data.items || [];
        const results = items.map((itemObj: any) => {
            const item = itemObj.item_basic;
            if (!item) return null;

            return {
                title: item.name,
                price: item.price / 100000, // Shopee API price is usually multiplied by 100000
                link: `https://shopee.tw/product/${item.shopid}/${item.itemid}`,
                image: `https://down-tw.img.susercontent.com/file/${item.image}`,
                platform: 'Shopee'
            };
        }).filter((i: any) => i !== null);

        console.log(`[Shopee] Found ${results.length} items`);
        return results;

    } catch (e: any) {
        // console.error("[Shopee] Error", e.message); 
        // Shopee often 403s without proper cookies/signatures. fail silently or log.
        return [];
    }
}
