import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

export default function ForgotPassword({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const startReset = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const supabase = await createClient();
        const origin = (await headers()).get("origin");

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/reset-password`,
        });

        if (error) {
            return redirect("/forgot-password?message=Could not send reset email. Check email and try again.");
        }

        return redirect("/forgot-password?message=Check your email to reset your password.");
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/login"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>
                Back
            </Link>

            <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                action={startReset}
            >
                <div className="flex flex-col gap-2 mb-4">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email address and we will send you a link to reset your password.
                    </p>
                </div>

                <Label className="text-md" htmlFor="email">
                    Email
                </Label>
                <Input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="email"
                    placeholder="you@example.com"
                    required
                />

                <Button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                    Send Reset Link
                </Button>

                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {searchParams.message}
                    </p>
                )}
            </form>
        </div>
    );
}
