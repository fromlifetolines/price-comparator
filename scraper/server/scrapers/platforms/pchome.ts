import puppeteer from 'puppeteer';

export async function PChomeScraper(keyword: string) {
    console.log(`[PChome] Starting scrape for ${keyword}`);
    // PChome 24h is tough with puppeteer due to heavy JS/anti-bot. 
    // This is a placeholder structure.
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(`https://ecshweb.pchome.com.tw/search/v3.3/?q=${encodeURIComponent(keyword)}`, { waitUntil: 'networkidle2' });

        // PChome loads data via API often, might need page.waitForResponse
        const items = await page.evaluate(() => {
            const results: any[] = [];
            const els = document.querySelectorAll('.col3f'); // Example class
            els.forEach((el) => {
                const title = el.querySelector('.prod_name')?.textContent;
                const price = el.querySelector('.price_value')?.textContent;
                if (title && price) {
                    results.push({ title, price, platform: 'PChome' });
                }
            });
            return results;
        });

        await browser.close();
        return items;
    } catch (e) {
        console.error("[PChome] Error", e);
        await browser.close();
        return [];
    }
}
