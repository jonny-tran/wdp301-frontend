import Link from "next/link";
import Can from "@/components/shared/Can";
import { P, PermissionType, ResourceType } from "@/lib/authz";
import { Resource } from "@/utils/constant";

interface KitchenQuickActionsProps {
    links: Array<{
        href: string;
        label: string;
        permission?: {
            action: PermissionType;
            resource: ResourceType;
        }
    }>;
}

export default function KitchenQuickActions({ links }: KitchenQuickActionsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {links.map((link) => {
                const content = (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-center text-sm font-bold text-text-main shadow-sm transition hover:border-primary/40 hover:text-primary"
                    >
                        {link.label}
                    </Link>
                );

                if (link.permission) {
                    return (
                        <Can key={link.href} I={link.permission.action} on={link.permission.resource}>
                            {content}
                        </Can>
                    );
                }

                return content;
            })}
        </div>
    );
}
