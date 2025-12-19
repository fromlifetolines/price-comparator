import axios from 'axios';
import * as cheerio from 'cheerio';

export async function CoupangScraper(keyword: string) {
    console.log(`[Coupang] Starting scrape for ${keyword} (Light Mode)`);
    try {
        const url = `https://www.tw.coupang.com/np/search?q=${encodeURIComponent(keyword)}&channel=user`;
        console.log(`[Coupang] Fetching ${url}`);

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
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
