
import { ChatInterface } from "@/components/chat-interface";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export default async function EmbedPage({
    params,
}: {
    params: { chatbotId: string };
}) {
    const { chatbotId } = params;

    // Use Service Role to fetch public chatbot info
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: chatbot } = await supabase
        .from("chatbots")
        .select("name, status")
        .eq("id", chatbotId)
        .single();

    if (!chatbot) {
        return notFound();
    }

    // Optional: Check status
    if (chatbot.status !== "active") {
        return (
            <div className="flex h-screen items-center justify-center text-muted-foreground p-4 text-center">
                This chatbot is currently offline.
            </div>
        );
    }

    return <ChatInterface chatbotId={chatbotId} />;
}
