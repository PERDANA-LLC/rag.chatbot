"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = 'ThomasPerdana@gmail.com';

async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
    }
}

export async function createProductAction(data: { name: string; description: string; price: number; interval: 'month' | 'year' }) {
    await verifyAdmin();

    const product = await stripe.products.create({
        name: data.name,
        description: data.description,
    });

    await stripe.prices.create({
        product: product.id,
        unit_amount: data.price * 100, // cents
        currency: 'usd',
        recurring: {
            interval: data.interval
        }
    });

    // We rely on webhook to sync to DB, but we could also manually insert if we want immediate feedback, 
    // but revalidatePath should show it once webhook lands. 
    // Actually, webhook is async. For better UX, we might wait or just accept eventual consistency.

    revalidatePath('/admin/products');
}

export async function deleteProductAction(productId: string) {
    await verifyAdmin();
    // Stripe doesn't allow true delete if it has transactions, so we archive.
    await stripe.products.update(productId, { active: false });
    revalidatePath('/admin/products');
}
