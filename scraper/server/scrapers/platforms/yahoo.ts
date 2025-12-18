import puppeteer from 'puppeteer';

export async function YahooScraper(keyword: string) {
    console.error(`[Yahoo] Starting scrape for ${keyword}`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(`https://tw.buy.yahoo.com/search/product?p=${encodeURIComponent(keyword)}`, { waitUntil: 'networkidle2' });

        // Example selector - needs to be updated based on real site structure
        const items = await page.evaluate(() => {
            const results: any[] = [];
            document.querySelectorAll('.BaseGridItem__grid___2wuJ7').forEach((el) => {
                const title = el.querySelector('.BaseGridItem__title___2HWui')?.textContent;
                const price = el.querySelector('.BaseGridItem__price___31jkj')?.textContent;
                const link = el.querySelector('a')?.href;
                if (title && price) {
                    results.push({ title, price, link, platform: 'Yahoo' });
                }
            });
            return results;
        });

        await browser.close();
        return items;
    } catch (e) {
        console.error("[Yahoo] Error", e);
        await browser.close();
        return [];
    }
}
