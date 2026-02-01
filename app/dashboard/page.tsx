
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold leading-none tracking-tight">
                    Welcome back!
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                    You are logged in as <span className="font-medium text-foreground">{user?.email}</span>.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Placeholder for future specific cards */}
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Active Chatbots</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">Total Conversations</p>
                </div>
            </div>
        </div>
    );
}
