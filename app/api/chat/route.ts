
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { RAGService } from "@/lib/ai/rag";

export async function POST(request: Request) {
    try {
        const { chatbotId, message, conversationId } = await request.json();

        if (!chatbotId || !message) {
            return new NextResponse("Missing chatbotId or message", { status: 400 });
        }

        // Initialize Admin Client (Bypass RLS for public chat)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let activeConversationId = conversationId;

        // 1. Create/Validate Conversation
        if (!activeConversationId) {
            const { data: conv, error: convError } = await supabase
                .from("conversations")
                .insert({ chatbot_id: chatbotId })
                .select()
                .single();

            if (convError || !conv) {
                throw new Error("Failed to create conversation");
            }
            activeConversationId = conv.id;
        }

        // 2. Store User Message
        await supabase.from("messages").insert({
            conversation_id: activeConversationId,
            role: "user",
            content: message
        });

        // 3. Generate Answer
        const answer = await RAGService.chat(chatbotId, message);

        // 4. Store Assistant Message
        await supabase.from("messages").insert({
            conversation_id: activeConversationId,
            role: "assistant",
            content: answer
        });

        return NextResponse.json({
            conversationId: activeConversationId,
            message: answer
        });

    } catch (error) {
        console.error("Chat error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
