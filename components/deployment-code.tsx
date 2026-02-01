
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState, useEffect } from "react";

export function DeploymentCode({ chatbotId }: { chatbotId: string }) {
    const [host, setHost] = useState("");

    useEffect(() => {
        setHost(window.location.origin);
    }, []);

    const scriptCode = `<script src="${host}/widget.js" data-chatbot-id="${chatbotId}"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(scriptCode);
        alert("Copied to clipboard!");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Embed Widget</CardTitle>
                <CardDescription>
                    Copy and paste this code into your website's HTML, before the closing &lt;/body&gt; tag.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md font-mono text-sm break-all relative group">
                    {scriptCode}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={copyToClipboard}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
