import puppeteer from 'puppeteer';

export async function PChomeScraper(keyword: string) {
    console.log(`[PChome] Starting scrape for ${keyword}`);
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

    try {
        const url = `https://ecshweb.pchome.com.tw/search/v3.3/?q=${encodeURIComponent(keyword)}`;
        console.log(`[PChome] Navigating to ${url}`);

        // Reference: https://github.com/ALiangLiang/pchome-api
        // We will directly fetch the API using Node's fetch (or axios if installed, but let's try browser page usage with correct headers or just simple page.goto(api))
        // Better yet, since we are in Node.js environment here (Puppeteer controlling it), we can't easily "fetch" from the Node side without installing axios. 
        // But we CAN navigate the page to the API JSON directly!

        console.log("[PChome] Navigating directly to API...");
        const apiUrl = `https://ecshweb.pchome.com.tw/search/v3.3/all/results?q=${encodeURIComponent(keyword)}&page=1&sort=rnk/dc`;

        await page.goto(apiUrl, { waitUntil: 'networkidle2' });

        // The page content should now be the raw JSON
        const jsonText = await page.evaluate(() => document.body.innerText);

        try {
            const json = JSON.parse(jsonText);
            const prods = json.prods || [];

            const items = prods.map((item: any) => ({
                title: item.name,
                price: item.price,
                link: `https://24h.pchome.com.tw/prod/${item.Id}`,
                image: `https://cs-a.ecimg.tw${item.picS}`,
                platform: 'PChome'
            }));

            console.log(`[PChome] Found ${items.length} items via API Navigation`);
            await browser.close();
            return items;
        } catch (e) {
            console.log("[PChome] JSON Parse Error (Might be blocked or not JSON)", e);
            await browser.close();
            return [];
        }

    } catch (e) {
        console.error("[PChome] Error", e);
        await browser.close();
        return [];
    }
}
