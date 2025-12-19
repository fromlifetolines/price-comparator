import axios from 'axios';
import * as cheerio from 'cheerio';

export async function MomoScraper(keyword: string) {
    console.log(`[MOMO] Starting scrape for ${keyword} (Light Mode)`);
    try {
        const url = `https://www.momoshop.com.tw/search/searchShop.jsp?keyword=${encodeURIComponent(keyword)}&searchType=1&curPage=1&_isFuzzy=0&showType=chessboardType`;
        console.log(`[MOMO] Fetching ${url}`);

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const results: any[] = [];

        $('.listArea ul li').each((_i, el) => {
            try {
                const title = $(el).find('.prdName').text().trim();
                const priceStr = $(el).find('.money .price b').text().replace(/,/g, '').trim();
                const price = parseFloat(priceStr);
                let link = $(el).find('.prdName a').attr('href') || '';

                if (link && !link.startsWith('http')) {
                    link = 'https://www.momoshop.com.tw' + link;
                }

                let image = $(el).find('.goodsImg').attr('src') || $(el).find('.goodsImg').attr('data-original') || '';

                if (title && price > 0) {
                    results.push({
                        title,
                        price,
                        link,
                        image,
                        platform: 'MOMO'
                    });
                }
            } catch (err) {
                // skip
            }
        });

        console.log(`[MOMO] Found ${results.length} items`);
        return results;

    } catch (e) {
        console.error("[MOMO] Error", e);
        return [];
    }
}
