import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/app/actions/stripe-products";

// Server Component for the item to handle delete with client interaction (via form action)
function ProductItem({ product }: { product: any }) {
    return (
        <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
                <h4 className="font-bold">{product.name}</h4>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="text-sm mt-1">
                    Status: <span className={product.active ? "text-green-600" : "text-red-600"}>{product.active ? 'Active' : 'Archived'}</span>
                </div>
            </div>
            <form action={async () => {
                "use server";
                await deleteProductAction(product.id);
            }}>
                <Button variant="destructive" size="sm" type="submit">Archive</Button>
            </form>
        </div>
    );
}

export default async function AdminProductsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'ThomasPerdana@gmail.com') {
        return notFound();
    }

    const { data: products } = await supabase
        .from('products')
        .select('*, prices(*)')
        .order('name');

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <p className="text-muted-foreground">Manage Stripe products and prices.</p>
            </div>

            <ProductForm />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Existing Products</h2>
                <div className="grid gap-4">
                    {(products as any[])?.map(product => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                    {!products?.length && <p>No products found.</p>}
                </div>
            </div>
        </div>
    );
}
