import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // Explicit check to handle potentially un-inferred types
    const userRole = (profile as any)?.role;

    if (userRole !== "super_admin") {
        return redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex gap-6 md:gap-10">
                        <Link href="/admin" className="flex items-center space-x-2">
                            <span className="font-bold sm:inline-block">Admin Dashboard</span>
                        </Link>
                        <nav className="flex gap-6">
                            <Link
                                href="/admin"
                                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                Overview
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                Users
                            </Link>
                            <Link
                                href="/dashboard"
                                className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                App Dashboard
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-muted-foreground">
                            {user.email} (Super Admin)
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </main>
        </div>
    );
}
