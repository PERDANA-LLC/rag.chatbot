
"use client";

import { useRealtimeChat } from "@/hooks/use-realtime-chat";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AgentChatWindow({ conversation, userId }: { conversation: any, userId: string }) {
    const { messages, sendMessage: sendMessageToChat } = useRealtimeChat(conversation.id);
    const [input, setInput] = useState("");
    const supabase = createClient();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput("");

        await sendMessageToChat(content, "assistant");
    }

    async function updateStatus(status: string) {
        await (supabase as any).from("conversations").update({
            status,
            assigned_to: status === 'waiting' ? null : userId
        } as any).eq("id", conversation.id);
        router.refresh();
        if (status === 'closed') router.push('/dashboard/inbox');
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] border rounded-lg bg-background">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/inbox">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h3 className="font-semibold">{conversation.chatbots?.name}</h3>
                        <div className="text-xs text-muted-foreground">Visitor: {conversation.visitor_id || "Anon"}</div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateStatus('waiting')}>
                        Release
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus('closed')}>
                        Close Chat
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            m.role === 'assistant'
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        <div className="text-[10px] opacity-70 mb-1 capitalize">{m.role}</div>
                        {m.content}
                    </div>
                ))}
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Reply as agent..."
                />
                <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}
