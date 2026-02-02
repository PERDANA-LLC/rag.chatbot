
import { createClient } from "@/utils/supabase/server";
import { InboxList } from "@/components/inbox-list";
import { redirect } from "next/navigation";

export default async function InboxPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Initial Fetch logic matches the client side logic needed
    // We want: status=waiting OR (status=active AND assigned_to=me)
    // Supabase syntax for server side
    const { data: conversations } = await supabase
        .from("conversations")
        .select("*, chatbots(name)")
        .or(`status.eq.waiting,and(status.eq.active,assigned_to.eq.${user.id})`)
        .order("created_at", { ascending: false });

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Agent Inbox</h1>
            <InboxList initialConversations={conversations || []} userId={user.id} />
        </div>
    );
}
