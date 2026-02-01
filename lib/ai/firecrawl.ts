
export interface CrawlResult {
    url: string;
    markdown: string;
}

export const FirecrawlService = {
    /**
     * Crawls a website and returns the markdown content for each page.
     */
    async crawlWebsite(url: string, limit: number = 10): Promise<CrawlResult[]> {
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
            throw new Error("FIRECRAWL_API_KEY is not configured");
        }

        // 1. Start the crawl
        const startResponse = await fetch("https://api.firecrawl.dev/v1/crawl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                url,
                limit, // Limit pages to avoid huge costs/time for now
                scrapeOptions: {
                    formats: ["markdown"]
                }
            }),
        });

        if (!startResponse.ok) {
            const errorText = await startResponse.text();
            throw new Error(`Firecrawl start failed: ${errorText}`);
        }

        const startData = await startResponse.json();
        const jobId = startData.id;

        if (!jobId) {
            // If synchronous response (sometimes happens for single page), handle it? 
            // But crawl is usually async.
            if (startData.data) {
                return startData.data.map((item: any) => ({
                    url: item.metadata?.sourceURL || url,
                    markdown: item.markdown
                }));
            }
            throw new Error("No job ID returned from Firecrawl");
        }

        // 2. Poll for results
        while (true) {
            const statusResponse = await fetch(`https://api.firecrawl.dev/v1/crawl/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });

            if (!statusResponse.ok) {
                throw new Error("Firecrawl status check failed");
            }

            const statusData = await statusResponse.json();
            const status = statusData.status;

            if (status === "completed") {
                return statusData.data.map((item: any) => ({
                    url: item.metadata?.sourceURL || item.url,
                    markdown: item.markdown,
                }));
            }

            if (status === "failed") {
                throw new Error("Firecrawl job failed");
            }

            // Wait 2s
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    },
};
