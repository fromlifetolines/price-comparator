import puppeteer from 'puppeteer';

export async function CoupangScraper(keyword: string) {
    console.log(`[Coupang] Starting scrape for ${keyword}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // Coupang Taiwan Search URL
        const url = `https://www.tw.coupang.com/np/search?q=${encodeURIComponent(keyword)}&channel=user`;
        console.log(`[Coupang] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2' });

        try {
            await page.waitForSelector('.search-product', { timeout: 8000 });
        } catch (e) {
            console.log("[Coupang] Timeout waiting for list.");
        }

        const items = await page.evaluate(() => {
            const results: any[] = [];
            const els = document.querySelectorAll('.search-product');

            els.forEach((el) => {
                const titleEl = el.querySelector('.name');
                const priceEl = el.querySelector('.price-value'); // often just number
                const linkEl = el.querySelector('a');
                const imgEl = el.querySelector('img.search-product-wrap-img');

                if (titleEl && priceEl) {
                    const title = titleEl.textContent?.trim() || '';
                    const priceStr = priceEl.textContent?.replace(/,/g, '').trim() || '0';
                    const price = parseFloat(priceStr);

                    let link = linkEl?.getAttribute('href') || '';
                    if (link && !link.startsWith('http')) {
                        link = 'https://www.tw.coupang.com' + link;
                    }

                    let image = imgEl?.getAttribute('src') || '';
                    // Coupang lazy load might use data-src
                    if (!image) image = imgEl?.getAttribute('data-src') || '';
                    if (image && image.startsWith('//')) image = 'https:' + image;

                    if (title && price > 0) {
                        results.push({
                            title,
                            price,
                            link,
                            image,
                            platform: 'Coupang'
                        });
                    }
                }
            });
            return results;
        });

        console.log(`[Coupang] Found ${items.length} items`);
        await browser.close();
        return items;
    } catch (e) {
        console.error("[Coupang] Error", e);
        await browser.close();
        return [];
    }
}
