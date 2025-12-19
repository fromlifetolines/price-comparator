
export async function PChomeScraper(keyword: string) {
    console.log(`[PChome] Starting scrape for ${keyword} (API Mode)`);
    // PChome has a public API, we can fetch directly to save memory and avoid Puppeteer crashes
    try {
        const apiUrl = `https://ecshweb.pchome.com.tw/search/v3.3/all/results?q=${encodeURIComponent(keyword)}&page=1&sort=rnk/dc`;

        console.log(`[PChome] Fetching API: ${apiUrl}`);
        const res = await fetch(apiUrl);

        if (!res.ok) {
            console.error(`[PChome] API Failed: ${res.statusText}`);
            return [];
        }

        const json = await res.json() as any;
        const prods = json.prods || [];

        const items = prods.map((item: any) => ({
            title: item.name,
            price: item.price,
            link: `https://24h.pchome.com.tw/prod/${item.Id}`,
            image: `https://cs-a.ecimg.tw${item.picS}`,
            platform: 'PChome'
        }));

        console.log(`[PChome] Found ${items.length} items via Fetch`);
        return items;

    } catch (e) {
        console.error("[PChome] Error", e);
        return [];
    }
}
