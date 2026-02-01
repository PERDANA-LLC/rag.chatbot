
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h1 className="text-4xl font-bold mb-6">Embeddable RAG Chatbot</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Deploy custom AI support agents to your website in minutes. Powered by your data.
            </p>
            <div className="flex gap-4">
                <Link href="/login">
                    <Button size="lg">Log In</Button>
                </Link>
                <Link href="/signup">
                    <Button size="lg" variant="outline">Sign Up</Button>
                </Link>
            </div>
        </div>
    );
}
