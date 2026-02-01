
import { createClient } from "@/utils/supabase/server";
import { KnowledgeUpload } from "@/components/knowledge-upload";
import { KnowledgeList } from "@/components/knowledge-list";
import { DeploymentCode } from "@/components/deployment-code";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ChatbotDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const supabase = await createClient();
    const { id } = params;

    // Fetch Chatbot
    const { data: chatbot, error: botError } = await supabase
        .from("chatbots")
        .select("*")
        .eq("id", id)
        .single() as any;

    if (botError || !chatbot) {
        return <div>Chatbot not found</div>;
    }

    // Fetch Sources
    const { data: sources } = await supabase
        .from("knowledge_base_sources")
        .select("*")
        .eq("chatbot_id", id)
        .order("created_at", { ascending: false }) as any;

    // Cast sources
    const typedSources = (sources || []).map((s: any) => ({
        id: s.id,
        type: s.type,
        source_url: s.source_url,
        status: s.status,
        created_at: s.created_at
    }));

    return (
        <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/chatbots">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">{chatbot.name}</h1>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {chatbot.status}
                </span>
            </div>

            <Tabs defaultValue="knowledge" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                    <TabsTrigger value="connect">Connect & Embed</TabsTrigger>
                </TabsList>

                <TabsContent value="knowledge">
                    <div className="grid gap-6 md:grid-cols-[350px_1fr]">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Add Knowledge</h2>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Upload PDF files or crawl websites to train your chatbot.
                                </p>
                                <KnowledgeUpload chatbotId={id} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Knowledge Sources</h2>
                                <KnowledgeList sources={typedSources} />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="connect">
                    <div className="max-w-2xl">
                        <DeploymentCode chatbotId={id} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
