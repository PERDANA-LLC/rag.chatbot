
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { FirecrawlService } from "@/lib/ai/firecrawl";
import { GeminiService } from "@/lib/ai/gemini";

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { url, chatbotId } = await request.json();

        if (!url || !chatbotId) {
            return new NextResponse("Missing url or chatbotId", { status: 400 });
        }

        // 1. Crawl Website
        const pages = await FirecrawlService.crawlWebsite(url);

        // 2. Process each page
        let successCount = 0;

        for (const page of pages) {
            if (!page.markdown) continue;

            // Create a separate file for each page to preserve context
            // We'll name it sanitized-pagetitle.md or similar
            // For simplicity, we use the URL as the name context
            const sanitizedName = page.url.replace(/[^a-z0-9]/gi, '_').substring(0, 50) + ".md";

            const file = new File([page.markdown], sanitizedName, { type: "text/markdown" });

            // Upload to Gemini
            const geminiFile = await GeminiService.uploadFile(file);

            // Store metadata
            await supabase.from("knowledge_base_sources").insert({
                chatbot_id: chatbotId,
                type: "url",
                content_uri: geminiFile.uri,
                source_url: page.url,
                status: "indexed"
            } as any);

            successCount++;
        }

        return NextResponse.json({ success: true, count: successCount });
    } catch (error) {
        console.error("Crawl error:", error);
        return new NextResponse(error instanceof Error ? error.message : "Internal Server Error", { status: 500 });
    }
}
