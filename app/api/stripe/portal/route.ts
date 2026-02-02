import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Get User
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 2. Get Organization
        const { data: profile } = await supabase
            .from('profiles')
            .select('org_id')
            .eq('id', user.id)
            .single() as any;

        if (!profile?.org_id) {
            return new NextResponse('Organization not found', { status: 404 });
        }

        const orgId = profile.org_id;

        const { data: org } = await supabase
            .from('organizations')
            .select('stripe_customer_id')
            .eq('id', orgId)
            .single() as any;

        if (!org || !org.stripe_customer_id) {
            return new NextResponse('No billing account found', { status: 404 });
        }

        // 3. Create Portal Session
        const session = await stripe.billingPortal.sessions.create({
            customer: org.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Portal Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
