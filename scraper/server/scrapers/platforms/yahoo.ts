import axios from 'axios';
import * as cheerio from 'cheerio';

export async function YahooScraper(keyword: string) {
    console.log(`[Yahoo] Starting scrape for ${keyword} (Light Mode)`);
    try {
        const url = `https://tw.buy.yahoo.com/search/product?p=${encodeURIComponent(keyword)}`;
        console.log(`[Yahoo] Fetching ${url}`);

        const { data } = await axios.get(url, {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://tw.buy.yahoo.com/',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate'
                }
            });
        });

        const $ = cheerio.load(data);
        const results: any[] = [];

        // Yahoo selectors are tricky, fall back to broad item selectors
        $('div[class*="BaseGridItem__grid"], li[class*="BaseGridItem__item"]').each((_i, el) => {
            try {
                const linkEl = $(el).find('a[href*="/product/"], a[href*="goods"]');
                const priceEl = $(el).find('span[class*="price"], .price, [class*="Price"]');
                const imgEl = $(el).find('img');

                if (linkEl.length && priceEl.length) {
                    const title = linkEl.attr('aria-label') || linkEl.text().trim() || $(el).find('[class*="title"]').text().trim();
                    const priceText = priceEl.text();
                    const priceMatch = priceText.match(/\$([\d,]+)/) || priceText.match(/([\d,]+)元/);
                    let price = 0;
                    if (priceMatch && priceMatch[1]) {
                        price = parseFloat(priceMatch[1].replace(/,/g, ''));
                    }

                    let link = linkEl.attr('href') || '';
                    if (link && !link.startsWith('http')) {
                        link = 'https://tw.buy.yahoo.com' + link;
                    }

                    const image = imgEl.attr('srcset')?.split(' ')[0] || imgEl.attr('src') || '';

                    if (title && price > 0) {
                        results.push({
                            title,
                            price,
                            link,
                            image,
                            platform: 'Yahoo'
                        });
                    }
                }
            } catch (err) {
                // skip
            }
        });

        console.log(`[Yahoo] Found ${results.length} items`);
        return results;

    } catch (e) {
        console.error("[Yahoo] Error", e);
        return [];
    }
}
