
import { createClient } from "@/utils/supabase/server";
import { AgentChatWindow } from "@/components/agent-chat-window";
import { redirect, notFound } from "next/navigation";

export default async function InboxChatPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    const { id } = params;

    const { data: conversation } = await supabase
        .from("conversations")
        .select("*, chatbots(name)")
        .eq("id", id)
        .single();

    if (!conversation) return notFound();

    return (
        <div className="p-6 h-screen flex flex-col">
            <AgentChatWindow conversation={conversation} userId={user.id} />
        </div>
    );
}
