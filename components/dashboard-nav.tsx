
import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
    {
        title: "Overview",
        href: "/dashboard",
    },
    {
        title: "Chatbots",
        href: "/dashboard/chatbots",
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
    },
];

interface DashboardNavProps extends React.HTMLAttributes<HTMLElement> {
    pathname?: string;
}

export function DashboardNav({ className, pathname, ...props }: DashboardNavProps) {
    return (
        <nav
            className={cn(
                "flex space-y-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "justify-start text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                        pathname === item.href
                            ? "bg-muted text-primary"
                            : "text-muted-foreground"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    );
}
