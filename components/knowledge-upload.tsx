
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function KnowledgeUpload({ chatbotId }: { chatbotId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleFileUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        formData.append("chatbotId", chatbotId);

        try {
            const res = await fetch("/api/knowledge/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            setMessage({ type: "success", text: "File uploaded successfully" });
            router.refresh();
            (event.target as HTMLFormElement).reset();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to upload file" });
        } finally {
            setLoading(false);
        }
    }

    async function handleCrawl(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const url = formData.get("url") as string;

        try {
            const res = await fetch("/api/knowledge/crawl", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, chatbotId }),
            });

            if (!res.ok) throw new Error("Crawl failed");

            const data = await res.json();
            setMessage({ type: "success", text: `Crawled ${data.count} pages` });
            router.refresh();
            (event.target as HTMLFormElement).reset();
        } catch (error) {
            setMessage({ type: "error", text: "Failed to crawl website" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="pt-6">
                <Tabs defaultValue="file" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="file">File Upload</TabsTrigger>
                        <TabsTrigger value="website">Website Crawl</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file">
                        <form onSubmit={handleFileUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">Upload PDF or Text</Label>
                                <Input id="file" name="file" type="file" accept=".pdf,.txt,.md" required />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Uploading..." : "Upload File"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="website">
                        <form onSubmit={handleCrawl} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">Website URL</Label>
                                <Input id="url" name="url" type="url" placeholder="https://example.com" required />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? "Start Crawling" : "Crawl Website"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                {message && (
                    <Alert className={`mt-4 ${message.type === "error" ? "bg-red-50" : "bg-green-50"}`}>
                        <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}
