
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

        // 2. Check Conversation Status
        const { data: conversation } = await supabase
            .from("conversations")
            .select("status")
            .eq("id", activeConversationId)
            .single();

        const status = conversation?.status || 'ai';

        // 3. Store User Message
        await supabase.from("messages").insert({
            conversation_id: activeConversationId,
            role: "user",
            content: message
        });

        if (status === 'active' || status === 'waiting') {
            // Handoff mode: distinct logic
            return NextResponse.json({
                conversationId: activeConversationId,
                message: null, // No AI response
                status
            });
        }


        // 4. Check Usage Limits
        const { data: chatbot } = await supabase
            .from('chatbots')
            .select('org_id')
            .eq('id', chatbotId)
            .single();

        if (!chatbot) {
            return new NextResponse("Chatbot not found", { status: 404 });
        }

        const { data: org } = await supabase
            .from('organizations')
            .select('subscription_status, messages_count')
            .eq('id', chatbot.org_id)
            .single();

        if (org) {
            const limit = org.subscription_status === 'active' ? 100000 : 50;
            if ((org.messages_count || 0) >= limit) {
                return NextResponse.json({
                    conversationId: activeConversationId,
                    message: "Usage limit reached. Please upgrade your plan.",
                    status: 'limit_reached'
                });
            }
        }

        // 5. Generate Answer (only if status is 'ai')
        const answer = await RAGService.chat(chatbotId, message);

        // 6. Store Assistant Message
        await supabase.from("messages").insert({
            conversation_id: activeConversationId,
            role: "assistant",
            content: answer
        });

        // 7. Increment Usage
        if (org) {
            await supabase.from('organizations').update({ messages_count: (org.messages_count || 0) + 1 }).eq('id', chatbot.org_id);
        }

        return NextResponse.json({
            conversationId: activeConversationId,
            message: answer,
            status: 'ai'
        });

    } catch (error) {
        console.error("Chat error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
