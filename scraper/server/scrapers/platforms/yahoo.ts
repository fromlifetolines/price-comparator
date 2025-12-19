import puppeteer from 'puppeteer';

export async function YahooScraper(keyword: string) {
    console.log(`[Yahoo] Starting scrape for ${keyword}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        const url = `https://tw.buy.yahoo.com/search/product?p=${encodeURIComponent(keyword)}`;
        console.log(`[Yahoo] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2' });

        try {
            await page.waitForSelector('.BaseGridItem__grid___2wuJ7', { timeout: 8000 });
        } catch (e) {
            // console.log("[Yahoo] Timeout waiting for items.");
        }

        const items = await page.evaluate(() => {
            const results: any[] = [];

            // Refined Strategy: Yahoo product items usually are in a main grid.
            // Look for elements that explicitly contain a link AND a price-like element
            // avoiding sidebar buttons.

            const candidateItems = document.querySelectorAll('div[class*="BaseGridItem__grid"], li[class*="BaseGridItem__item"]');
            // If the above fails, fall back to generic but filter by content
            const allCandidates = candidateItems.length > 0 ? candidateItems : document.querySelectorAll('li, div');

            allCandidates.forEach((el) => {
                // Must have a link to product
                const linkEl = el.querySelector('a[href*="/product/"], a[href*="goods"]');
                if (!linkEl) return;

                // Must have a price
                const priceEl = el.querySelector('span[class*="price"], .price, [class*="Price"]');
                if (!priceEl) return;

                // Must have an image
                const imgEl = el.querySelector('img');
                if (!imgEl) return;

                const title = linkEl.getAttribute('aria-label') || el.querySelector('[class*="title"]')?.textContent?.trim() || linkEl.textContent?.trim() || '';
                const priceText = priceEl.textContent || '';
                const priceMatch = priceText.match(/\$([\d,]+)/) || priceText.match(/([\d,]+)元/);

                let price = 0;
                if (priceMatch) {
                    price = parseFloat(priceMatch[1].replace(/,/g, ''));
                }

                let link = linkEl.getAttribute('href') || '';
                if (link && !link.startsWith('http')) {
                    link = 'https://tw.buy.yahoo.com' + link;
                }

                let image = imgEl.getAttribute('srcset')?.split(' ')[0] || imgEl.getAttribute('src') || '';

                // Basic validation to filter out junk
                if (title && price > 0 && title.length > 5) {
                    results.push({
                        title,
                        price,
                        link,
                        image,
                        platform: 'Yahoo'
                    });
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
