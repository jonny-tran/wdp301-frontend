import Link from "next/link";

interface KitchenQuickActionsProps {
    links: Array<{ href: string; label: string }>;
}

export default function KitchenQuickActions({ links }: KitchenQuickActionsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center text-sm font-bold text-text-main shadow-sm transition hover:border-primary/40 hover:text-primary"
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
}
