
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ChatbotsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return redirect("/login");

    // Fetch chatbots
    const { data: chatbots } = await supabase
        .from("chatbots")
        .select("*")
        .order("created_at", { ascending: false }) as any;

    // Create Chatbot Action
    async function createChatbot() {
        "use server";
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect("/login");
        }

        // Get Org ID (Hack: Just pick the first linked profile org or create one if missing? 
        // For now, assuming user has profile with org_id)
        const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single() as any;

        if (!profile?.org_id) {
            throw new Error("No organization found");
        }

        const { data, error } = await supabase.from("chatbots").insert({
            org_id: profile.org_id,
            name: "New Chatbot",
            status: "active"
        } as any).select().single() as any;

        if (data) {
            redirect(`/dashboard/chatbots/${data.id}`);
        }
    }

    return (
        <div className="flex flex-col gap-8 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Chatbots</h1>
                <form action={createChatbot}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Chatbot
                    </Button>
                </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chatbots?.map((bot: any) => (
                    <Link
                        key={bot.id}
                        href={`/dashboard/chatbots/${bot.id}`}
                        className="block p-6 border rounded-lg hover:border-primary transition-colors bg-card"
                    >
                        <div className="font-semibold text-lg">{bot.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Status: {bot.status}
                        </div>
                    </Link>
                ))}
                {chatbots?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-dashed border-2 rounded-lg">
                        No chatbots found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
