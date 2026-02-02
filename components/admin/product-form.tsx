"use client";

import { createProductAction } from "@/app/actions/stripe-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export function ProductForm() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState("");
    const [interval, setInterval] = useState<'month' | 'year'>('month');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await createProductAction({
                name,
                description: desc,
                price: parseFloat(price),
                interval
            });
            // Reset form
            setName("");
            setDesc("");
            setPrice("");
        } catch (error) {
            console.error(error);
            alert("Failed to create product");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg bg-card text-card-foreground">
            <h3 className="font-semibold text-lg">Create New Product</h3>
            <div>
                <label className="text-sm">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
                <label className="text-sm">Description</label>
                <Input value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-sm">Price (USD)</label>
                    <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="flex-1">
                    <label className="text-sm">Interval</label>
                    <Select value={interval} onValueChange={(v: any) => setInterval(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
            </Button>
        </form>
    );
}
