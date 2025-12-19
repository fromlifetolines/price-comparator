import axios from 'axios';
import * as cheerio from 'cheerio';

export async function CoupangScraper(keyword: string) {
    console.log(`[Coupang] Starting scrape for ${keyword} (Light Mode)`);
    try {
        const url = `https://www.tw.coupang.com/np/search?q=${encodeURIComponent(keyword)}&channel=user`;
        console.log(`[Coupang] Fetching ${url}`);

        const { data } = await axios.get(url, {
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
                }
            });
        });

        const $ = cheerio.load(data);
        const results: any[] = [];

        $('.search-product').each((_i, el) => {
            try {
                const title = $(el).find('.name').text().trim();
                const priceStr = $(el).find('.price-value').text().replace(/,/g, '').trim();
                const price = parseFloat(priceStr);
                let link = $(el).find('a').attr('href') || '';

                if (link && !link.startsWith('http')) {
                    link = 'https://www.tw.coupang.com' + link;
                }

                let image = $(el).find('img.search-product-wrap-img').attr('src') || $(el).find('img.search-product-wrap-img').attr('data-src') || '';
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
            } catch (err) {
                // skip
            }
        });

        console.log(`[Coupang] Found ${results.length} items`);
        return results;

    } catch (e) {
        console.error("[Coupang] Error", e);
        return [];
    }
}
