import puppeteer from 'puppeteer';

export async function MomoScraper(keyword: string) {
    console.log(`[MOMO] Starting scrape for ${keyword}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();

    // Set User-Agent to avoid basic bot detection
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        // MOMO Search URL
        const url = `https://www.momoshop.com.tw/search/searchShop.jsp?keyword=${encodeURIComponent(keyword)}&searchType=1&curPage=1&_isFuzzy=0&showType=chessboardType`;
        console.log(`[MOMO] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Wait for product list to load
        // Selector for MOMO usually involves #BodyTable or .listArea
        try {
            await page.waitForSelector('.listArea ul li', { timeout: 5000 });
        } catch (e) {
            // If the primary selector fails, it might be a different layout or no results.
            // We'll proceed with the evaluation, which will return an empty array if no products are found.
        }

        // Enable console logs from browser
        page.on('console', msg => console.log('[MOMO Browser]', msg.text()));

        const items = await page.evaluate(() => {
            const results: any[] = [];
            // Select all product cards
            const products = document.querySelectorAll('.listArea ul li');

            products.forEach((el) => {
                try {
                    const titleEl = el.querySelector('.prdName'); // h3 or a
                    const priceEl = el.querySelector('.money .price b'); // price value is in <b>
                    const linkEl = el.querySelector('.prdName a'); // Link is in the title anchor
                    const imgEl = el.querySelector('.goodsImg');

                    if (titleEl && priceEl && linkEl) {
                        const title = titleEl.textContent?.trim() || '';
                        // MOMO prices often include commas, e.g. "1,299"
                        const priceStr = priceEl.textContent?.replace(/,/g, '').trim() || '0';
                        const price = parseFloat(priceStr);

                        let link = linkEl.getAttribute('href') || '';
                        if (link && !link.startsWith('http')) {
                            link = 'https://www.momoshop.com.tw' + link;
                        }

                        let image = '';
                        if (imgEl) {
                            image = imgEl.getAttribute('src') || imgEl.getAttribute('data-original') || '';
                        }

                        if (title && price > 0) {
                            results.push({
                                title,
                                price,
                                link,
                                image,
                                platform: 'MOMO'
                            });
                        }
                    }
                } catch (err) {
                    // Skip bad item
                }
            });
            return results;
        });

        console.log(`[MOMO] Found ${items.length} items`);
        await browser.close();
        return items;

    } catch (e) {
        console.error("[MOMO] Error:", e);
        await browser.close();
        return [];
    }
}
