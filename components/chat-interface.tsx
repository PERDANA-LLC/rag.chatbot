
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatbotId,
                    message: userMessage.content,
                    conversationId,
                }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data = await res.json();

            if (data.conversationId) {
                setConversationId(data.conversationId);
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            // Could show error toast
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* Header (Optional, maybe hidden in embedding if parent handles it) */}
            <div className="p-4 border-b bg-card flex items-center gap-2 shadow-sm">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-sm">AI Support</h3>
                    <p className="text-xs text-muted-foreground">Ask me anything</p>
                </div>
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
                {isLoading && (
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
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
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
