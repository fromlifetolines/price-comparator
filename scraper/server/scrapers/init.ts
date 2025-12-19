import { YahooScraper } from './platforms/yahoo';
import { PChomeScraper } from './platforms/pchome';
import { MomoScraper } from './platforms/momo';
import { ShopeeScraper } from './platforms/shopee';
import { CoupangScraper } from './platforms/coupang';

const PLATFORMS_LIST = ['Yahoo', 'PChome', 'MOMO', 'Shopee', 'Coupang'];

async function scrapeAll(term: string): Promise<any[]> {
    console.error(`[Scraper] Executing for: "${term}"`);

    const results = await Promise.allSettled([
        YahooScraper(term),
        PChomeScraper(term),
        MomoScraper(term),
        ShopeeScraper(term),
        CoupangScraper(term)
    ]);

    const products: any[] = [];
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const items = result.value;
            console.error(`${PLATFORMS_LIST[index]} finished: ${items.length} items found.`);
            products.push(...items);
        } else {
            console.error(`${PLATFORMS_LIST[index]} failed:`, result.reason);
        }
    });
    return products;
}

async function main() {
    console.error("Starting Price Comparator Scrapers...");
    let searchTerm = process.argv[2];

    if (!searchTerm) {
        console.log("[]");
        return;
    }

    try {
        // 1. Initial Search
        let allProducts = await scrapeAll(searchTerm);

        // 2. Smart Retry (Fuzzy Fallback)
        // If 0 results, try broader keywords by removing the last word
        // e.g., "iPad Pro M5" -> "iPad Pro" -> "iPad"
        const MAX_RETRIES = 2; // Don't go too broad too infinitely
        let retries = 0;

        while (allProducts.length === 0 && searchTerm.includes(' ') && retries < MAX_RETRIES) {
            const words = searchTerm.split(' ');
            words.pop(); // Remove last word
            const newTerm = words.join(' ');

            if (newTerm.length < 2) break; // Don't search for single char

            console.error(`[Scraper] 0 results found. Retrying with broader term: "${newTerm}"`);
            searchTerm = newTerm;
            retries++;

            allProducts = await scrapeAll(searchTerm);
        }

        // Output ONLY the JSON to stdout
        console.log(JSON.stringify(allProducts));

    } catch (error) {
        console.error("Global Scraper Error:", error);
        console.log("[]");
    }
}

main();
