
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

import { useRealtimeChat } from "@/hooks/use-realtime-chat";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export function ChatInterface({
    chatbotId,
    initialMessages = [],
}: {
    chatbotId: string;
    initialMessages?: Message[];
}) {
    const [conversationId, setConversationId] = useState<string | null>(null);
    const { messages: realtimeMessages } = useRealtimeChat(conversationId);

    // We combine initial messages (history) with realtime messages
    // Ideally, realtimeMessages should handle all messages if we pass conversationId. 
    // But initially conversationId is null.
    // So we rely on local 'messages' state until conversationId is established?
    // Actually, once conversationId is established, useRealtimeChat fetches all messages.
    // So distinct modes:
    // 1. No conversation -> local state
    // 2. Conversation -> realtime state

    const [localMessages, setLocalMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'ai' | 'waiting' | 'active'>('ai');

    const messages = conversationId ? realtimeMessages : localMessages;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const content = input;

        // Optimistic update for local only (if no conversation yet)
        if (!conversationId) {
            setLocalMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'user',
                content
            }]);
        }

        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatbotId,
                    message: content,
                    conversationId,
                }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data = await res.json();

            if (data.conversationId && !conversationId) {
                setConversationId(data.conversationId);
            }

            if (data.status) {
                setStatus(data.status);
            }

            // If message is returned (AI response), add it.
            // But if we switched to realtime (conversationId set), the hook will pick it up.
            // The hook subscribes to INSERTs.
            // The API inserts the AI message.
            // So we might duplicate if we manually add it AND hook adds it.
            // So if conversationId is set, DO NOT manually add response.

            if (!data.conversationId && data.message) {
                // Fallback if no conversation ID returned (unlikely)
                setLocalMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.message
                }]);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function requestAgent() {
        if (!conversationId) return; // Must start chat first? Or validation needed.

        try {
            // We can call a server action or an API route to update status.
            // For now, let's reuse a simple API or supabase client if available.
            // Since this is a client component, we can import createClient.
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();

            await (supabase.from("conversations") as any).update({ status: 'waiting' }).eq('id', conversationId);
            setStatus('waiting');
        } catch (e) {
            console.error("Failed to request agent", e);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* Header */}
            <div className="p-4 border-b bg-card flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">AI Support</h3>
                        <p className="text-xs text-muted-foreground">
                            {status === 'ai' ? 'Ask me anything' :
                                status === 'waiting' ? 'Waiting for agent...' : 'Talking to Agent'}
                        </p>
                    </div>
                </div>
                {status === 'ai' && conversationId && (
                    <Button size="sm" variant="outline" onClick={requestAgent}>
                        Talk to Human
                    </Button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-8">
                        Send a message to start chatting.
                    </div>
                )}
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={cn(
                            "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                            m.role === "user"
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        {m.content}
                    </div>
                ))}
                {isLoading && !conversationId && (
                    <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground">
                        <span className="animate-pulse">Thinking...</span>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading && !conversationId}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={(isLoading && !conversationId) || !input.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">Powered by RAG Chatbot</p>
                </div>
            </form>
        </div>
    );
}
