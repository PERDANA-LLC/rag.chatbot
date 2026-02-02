
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GoogleSignIn } from "@/components/auth/google-sign-in";

export default function Login({
    searchParams,
}: {
    searchParams: { message: string };
}) {
    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const remember = formData.get("remember");
        const supabase = await createClient();

        // Note: Supabase SSR handles session persistence via cookies automatically.
        // There isn't a direct "remember me" flag in signInWithPassword on the server
        // that alters the cookie expiration dynamically in this pattern easily without custom cookie logic.
        // However, standard Supabase sessions are persistent by default (refresh tokens).

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/dashboard");
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <Link
                href="/"
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
                action={signIn}
            >
                <h1 className="text-2xl font-bold mb-4">Login</h1>

                <Label className="text-md" htmlFor="email">
                    Email
                </Label>
                <Input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <Label className="text-md" htmlFor="password">
                    Password
                </Label>
                <Input
                    className="rounded-md px-4 py-2 bg-inherit border mb-2"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                            htmlFor="remember"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Remember me
                        </label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-4 w-full">
                    Sign In
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <GoogleSignIn />

                <div className="text-center text-sm mt-4">
                    Don't have an account? <Link href="/signup" className="underline">Sign Up</Link>
                </div>

                {searchParams?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                        {searchParams.message}
                    </p>
                )}
            </form>
        </div>
    );
}
