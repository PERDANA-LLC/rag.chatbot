"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface Organization {
    id: string;
    name: string;
    subscription_status: string | null;
    messages_count: number | null;
}

export function SubscriptionCard({ org }: { org: Organization }) {
    const [loading, setLoading] = useState(false);

    const isPro = org.subscription_status === 'active';
    const limit = isPro ? 100000 : 50;
    const usage = org.messages_count || 0;
    const percentage = Math.min((usage / limit) * 100, 100);

    async function handleUpgrade() {
        setLoading(true);
        try {
            // Use dummy or env var for price ID
            const priceId = process.env.NEXT_PUBLIC_PRO_PRICE_ID || 'price_1Q...';
            if (!priceId || priceId.startsWith('price_1Q')) {
                alert("Please configure NEXT_PUBLIC_PRO_PRICE_ID in .env.local");
                setLoading(false);
                return;
            }

            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            });
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    async function handleManage() {
        setLoading(true);
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST'
            });
            const data = await res.json();
            window.location.href = data.url;
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>Manage your plan and usage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium">Current Plan</p>
                        <p className="text-sm text-muted-foreground capitalize">{org.subscription_status || 'Free'}</p>
                    </div>
                    {isPro && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Pro Active</span>}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Message Usage</span>
                        <span>{usage} / {limit}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    {percentage >= 90 && <p className="text-xs text-red-500">Approaching limit!</p>}
                </div>
            </CardContent>
            <CardFooter>
                {!isPro ? (
                    <Button onClick={handleUpgrade} disabled={loading}>
                        {loading ? 'Redirecting...' : 'Upgrade to Pro'}
                    </Button>
                ) : (
                    <Button variant="outline" onClick={handleManage} disabled={loading}>
                        {loading ? 'Redirecting...' : 'Manage Subscription'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
