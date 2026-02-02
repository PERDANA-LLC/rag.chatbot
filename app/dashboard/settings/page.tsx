import { createClient } from "@/utils/supabase/server";
import { SubscriptionCard } from "@/components/subscription-card";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', user.id)
        .single() as any;

    if (!profile?.org_id) {
        return <div>No Organization Found</div>;
    }

    const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.org_id)
        .single() as any;

    return (
        <div className="p-8 max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your organization and subscription.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <SubscriptionCard org={org} />
                {/* Additional settings can go here */}
            </div>
        </div>
    );
}
