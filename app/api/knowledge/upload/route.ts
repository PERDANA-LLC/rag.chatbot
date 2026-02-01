
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
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
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const chatbotId = formData.get("chatbotId") as string;

        if (!file || !chatbotId) {
            return new NextResponse("Missing file or chatbotId", { status: 400 });
        }

        // 1. Upload to Gemini
        const geminiFile = await GeminiService.uploadFile(file);

        // 2. Store metadata in Supabase
        const { error } = await supabase.from("knowledge_base_sources").insert({
            chatbot_id: chatbotId,
            type: "file",
            content_uri: geminiFile.uri,
            source_url: file.name,
            status: "indexed",
        } as any);

        if (error) {
            console.error("Supabase error:", error);
            // Try to clean up Gemini file if DB fails? (Optional for now)
            return new NextResponse("Database Error", { status: 500 });
        }

        return NextResponse.json({ success: true, file: geminiFile });
    } catch (error) {
        console.error("Upload error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
