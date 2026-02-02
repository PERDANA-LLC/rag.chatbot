

import { GeminiService } from "@/lib/ai/gemini";

export const RAGService = {
    async chat(chatbotId: string, query: string): Promise<string> {


        // 1. Fetch sources
        // Note: We use the service role or ensure the calling user has access.
        // Since this is called from API route, we might need a Service Role client if the user is 'anon'
        // But wait, createClient uses cookies. If this is a public chat, it might be anonymous.
        // The RLS allows owners to view sources. Anon users CANNOT view sources.
        // So we need a Service Role client here to fetch sources for the chatbot.
        // HOWEVER, we shouldn't expose sources content to anon, but we use them server-side.

        // For now, let's assume valid session or upgradeto admin for retrieval.
        // Actually better: Use a specific function or just use Service Role for this specific query.
        // I don't have a service_role helper yet.
        // I'll stick to `createClient` but `knowledge_base_sources` RLS prevents anon read.
        // I MUST IMPLEMENT SERVICE ROLE CLIENT for public chat RAG.

        // Temporary: I will assume I need to create a service role client.
        // But I don't want to complicate `utils/supabase/server.ts`.
        // I'll skip RLS check by using `supbase-js` directly with Service Key if needed? 
        // Recommended: Use `createClient` with cookies from headers, but if no cookie -> anon.

        // Changing approach: The `/api/chat` route will be hit by the Public Widget (No Auth Cookies).
        // So `createClient` will be Anon.
        // Anon cannot read `knowledge_base_sources` due to RLS.
        // So I need to use `process.env.SUPABASE_SERVICE_ROLE_KEY`.

        // FIX: Import `createClient` from `@supabase/supabase-js` for admin operations.
        // I will write a local helper or just import here.

        const { createClient: createAdmin } = await import("@supabase/supabase-js");
        const adminAuthClient = createAdmin(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: sources } = await adminAuthClient
            .from("knowledge_base_sources")
            .select("content_uri")
            .eq("chatbot_id", chatbotId)
            .eq("status", "indexed");

        if (!sources || sources.length === 0) {
            // Fallback or just answer without context?
            // Gemini can answer generic questions.
            // But for RAG, we might return "I don't have any knowledge about this."
            // Let's try to answer anyway (or return a standard message).
            // Let's answer with empty context list.
            return GeminiService.generateAnswer(query, []);
        }

        const fileUris = sources.map((s) => s.content_uri).filter((uri): uri is string => typeof uri === 'string');

        // 2. Generate Answer
        // We might want to pass history here too?
        // Gemini supports `history` array.
        // `GeminiService.generateAnswer` currently handles single turn.
        // I will stick to single turn + RAG context for this MVP iteration.

        const answer = await GeminiService.generateAnswer(query, fileUris);
        return answer;
    }
};
