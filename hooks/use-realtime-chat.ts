
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";

type Message = Database["public"]["Tables"]["messages"]["Row"];

export function useRealtimeChat(conversationId: string | null) {
    const [messages, setMessages] = useState<Message[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        // 1. Fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });

            if (data) {
                setMessages(data);
            }
        };

        fetchMessages();

        // 2. Subscribe to new messages
        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase]);

    const sendMessage = async (content: string, role: "user" | "assistant" = "user") => {
        if (!conversationId) return;

        const { error } = await (supabase.from("messages") as any).insert({
            conversation_id: conversationId,
            role,
            content,
        });

        if (error) {
            console.error("Error sending message:", error);
        }
    };

    return { messages, setMessages, sendMessage };
}
