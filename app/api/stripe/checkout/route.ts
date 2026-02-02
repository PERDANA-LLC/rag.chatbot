import { Stripe } from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { priceId } = await request.json();
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
            .select('stripe_customer_id, email') // Assuming we might want email, but org doesn't have email usually. User has.
            .eq('id', orgId)
            .single() as any;

        if (!org) {
            return new NextResponse('Organization not found', { status: 404 });
        }

        let customerId = org.stripe_customer_id;

        // 3. Create Stripe Customer if needed
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email, // Use user's email for billing for now
                metadata: {
                    orgId: orgId
                }
            });
            customerId = customer.id;

            // Update Org
            await (supabase.from('organizations') as any).update({ stripe_customer_id: customerId }).eq('id', orgId);
        }

        // 4. Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=canceled`,
            metadata: {
                orgId: orgId
            },
            client_reference_id: orgId
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
