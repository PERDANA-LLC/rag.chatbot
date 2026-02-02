import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy'
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const subscriptionId = session.subscription as string;
        const orgId = session.client_reference_id;

        if (!orgId) {
            return new NextResponse('Org ID missing in metadata', { status: 400 });
        }

        // Retrieve subscription to get plan details (price id) if needed, 
        // or just rely on the fact it's active.
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        await supabaseAdmin
            .from('organizations')
            .update({
                subscription_status: 'active',
                stripe_customer_id: session.customer as string,
                plan_id: priceId
            })
            .eq('id', orgId);
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabaseAdmin
            .from('organizations')
            .update({
                subscription_status: 'canceled',
                plan_id: null
            })
            .eq('stripe_customer_id', customerId);
    }

    if (event.type === 'product.created' || event.type === 'product.updated') {
        const product = event.data.object as Stripe.Product;
        await supabaseAdmin.from('products').upsert({
            id: product.id,
            active: product.active,
            name: product.name,
            description: product.description,
            image: product.images?.[0] ?? null,
            metadata: product.metadata
        });
    }

    if (event.type === 'price.created' || event.type === 'price.updated') {
        const price = event.data.object as Stripe.Price;
        await supabaseAdmin.from('prices').upsert({
            id: price.id,
            product_id: price.product as string,
            active: price.active,
            currency: price.currency,
            description: price.nickname,
            type: price.type,
            unit_amount: price.unit_amount,
            interval: price.recurring?.interval,
            interval_count: price.recurring?.interval_count,
            trial_period_days: price.recurring?.trial_period_days,
            metadata: price.metadata
        });
    }

    return new NextResponse('Receiver', { status: 200 });
}
