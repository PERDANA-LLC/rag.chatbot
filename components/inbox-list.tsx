
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { RefreshCcw } from "lucide-react";

export function InboxList({ initialConversations, userId }: { initialConversations: any[], userId: string }) {
    const [conversations, setConversations] = useState<any[]>(initialConversations);
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    async function fetchConversations() {
        setLoading(true);
        // Fetch waiting or assigned to me
        const { data } = await supabase
            .from("conversations")
            .select("*, chatbots(name)")
            .or(`status.eq.waiting,and(status.eq.active,assigned_to.eq.${userId})`)
            .order("created_at", { ascending: false });

        if (data) setConversations(data);
        setLoading(false);
    }

    async function claimChat(id: string) {
        await (supabase as any).from("conversations").update({
            status: "active",
            assigned_to: userId
        } as any).eq("id", id);
        fetchConversations();
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active & Waiting</h2>
                <Button size="sm" variant="outline" onClick={fetchConversations} disabled={loading}>
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4">
                {conversations.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground border rounded bg-muted/20">
                        No conversations found.
                    </div>
                )}
                {conversations.map((conv) => (
                    <Card key={conv.id} className={conv.status === 'waiting' ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-green-400'}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-semibold">{conv.chatbots?.name || "Accessory Bot"}</div>
                                <div className="text-xs text-muted-foreground">
                                    Visitor: {conv.visitor_id || "Anonymous"} • {formatDistanceToNow(new Date(conv.created_at))} ago
                                </div>
                                <div className="mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${conv.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {conv.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {conv.status === 'waiting' && (
                                    <Button size="sm" onClick={() => claimChat(conv.id)}>Claim</Button>
                                )}
                                <Link href={`/dashboard/inbox/${conv.id}`}>
                                    <Button size="sm" variant="secondary">View</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
