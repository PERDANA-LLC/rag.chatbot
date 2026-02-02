import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function ResetPassword({
    searchParams,
}: {
    searchParams: { message: string; code?: string };
}) {
    const resetPassword = async (formData: FormData) => {
        "use server";

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const supabase = await createClient();

        if (password !== confirmPassword) {
            return redirect("/reset-password?message=Passwords do not match");
        }

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            return redirect("/reset-password?message=Could not reset password. Please try again.");
        }

        return redirect("/login?message=Password reset successfully. Please login with your new password.");
    };

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
            <form
                className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
                action={resetPassword}
            >
                <div className="flex flex-col gap-2 mb-4">
                    <h1 className="text-2xl font-bold">Set New Password</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your new password below.
                    </p>
                </div>

                <Label className="text-md" htmlFor="password">
                    New Password
                </Label>
                <Input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />

                <Label className="text-md" htmlFor="confirmPassword">
                    Confirm Password
                </Label>
                <Input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                />

                <Button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
                    Update Password
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
