import { YahooScraper } from './platforms/yahoo';
import { PChomeScraper } from './platforms/pchome';
import { MomoScraper } from './platforms/momo';
import { ShopeeScraper } from './platforms/shopee';
import { CoupangScraper } from './platforms/coupang';

async function main() {
    console.log("Starting Price Comparator Scrapers...");

    const searchTerm = process.argv[2] || "iPhone 15"; // Default search term
    console.log(`Scraping for: ${searchTerm}`);

    // Clean up browser instances if they hang
    // In a real app, use a queue system (Bull/Redis)

    try {
        const results = await Promise.allSettled([
            YahooScraper(searchTerm),
            PChomeScraper(searchTerm),
            MomoScraper(searchTerm),
            ShopeeScraper(searchTerm),
            CoupangScraper(searchTerm)
        ]);

        results.forEach((result, index) => {
            const platforms = ['Yahoo', 'PChome', 'MOMO', 'Shopee', 'Coupang'];
            if (result.status === 'fulfilled') {
                console.log(`${platforms[index]} finished: ${result.value.length} items found.`);
                // TODO: Save to database
            } else {
                console.error(`${platforms[index]} failed:`, result.reason);
            }
        });

    } catch (error) {
        console.error("Global Scraper Error:", error);
    }
}

main();
