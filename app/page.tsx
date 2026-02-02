import { createClient } from "@/utils/supabase/server";
import { Navbar } from "@/components/landing/navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let userRole = null;
    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
        userRole = (profile as any)?.role;
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar user={user} role={userRole} />

            <main className="flex-1">
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                            Embeddable RAG Chatbot
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Deploy custom AI support agents to your website in minutes. Powered by your data.
                        </p>
                        <div className="space-x-4">
                            {!user && (
                                <Link href="/signup">
                                    <Button size="lg" className="px-8">
                                        Get Started
                                    </Button>
                                </Link>
                            )}
                            <Link href={user ? "/dashboard" : "/login"}>
                                <Button variant="outline" size="lg" className="px-8">
                                    {user ? "Go to Dashboard" : "Login"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 rounded-lg">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Features
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            Everything you need to build your own custom Support AI.
                        </p>
                    </div>
                    {/* Feature grid could go here */}
                </section>
            </main>
        </div>
    );
}
