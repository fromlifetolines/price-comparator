import puppeteer from 'puppeteer';

export async function ShopeeScraper(keyword: string) {
    console.log(`[Shopee] Starting scrape for ${keyword}`);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Shopee is aggressive with anti-bot. We need a realistic User-Agent.
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        const url = `https://shopee.tw/search?keyword=${encodeURIComponent(keyword)}`;
        console.log(`[Shopee] Navigating to ${url}`);

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Shopee lazy loads. We might need to scroll.
        try {
            await page.waitForSelector('[data-sqe="name"]', { timeout: 8000 });
        } catch (e) {
            console.log("[Shopee] Timeout waiting for items. Might be captcha or empty.");
            await page.screenshot({ path: '/Users/howard/.gemini/antigravity/brain/57ccde1c-0e07-489e-a8b2-5f47dc42e8c9/shopee_debug.png' });
        }

        const items = await page.evaluate(() => {
            const results: any[] = [];
            // Shopee uses data-sqe attributes which are stable
            const els = document.querySelectorAll('.shopee-search-item-result__item');

            els.forEach((el) => {
                try {
                    // Try to find elements by stable attributes or structure
                    const titleEl = el.querySelector('[data-sqe="name"] div'); // The text is inside a div inside the naming container
                    const priceEl = el.querySelector('[data-sqe="name"] + div span:nth-child(2)') || el.querySelector('div[class*="text-shopee-primary"] span:nth-child(2)');
                    // Price selector is tricky in Shopee, usually follows name or is distinct color class

                    const linkEl = el.querySelector('a[data-sqe="link"]');
                    const imgEl = el.querySelector('img');

                    if (linkEl) {
                        const title = titleEl?.textContent?.trim() || '';
                        // Shopee price might be range "$100 - "$200", we take the first number or simple text
                        let priceText = el.textContent || '';
                        // Simplistic regex to find price in the card text if specific selector fails
                        // Looking for $1,234 format
                        const priceMatch = priceText.match(/\$([\d,]+)/);
                        let price = 0;
                        if (priceMatch) {
                            price = parseFloat(priceMatch[1].replace(/,/g, ''));
                        }

                        let link = linkEl.getAttribute('href') || '';
                        if (link && !link.startsWith('http')) {
                            link = 'https://shopee.tw' + link;
                        }

                        let image = imgEl?.getAttribute('src') || '';

                        if (title && price > 0) {
                            results.push({
                                title,
                                price,
                                link,
                                image,
                                platform: 'Shopee'
                            });
                        }
                    }
                } catch (err) { }
            });
            return results;
        });

        console.log(`[Shopee] Found ${items.length} items`);
        await browser.close();
        return items;
    } catch (e) {
        console.error("[Shopee] Error", e);
        await browser.close();
        return [];
    }
}
