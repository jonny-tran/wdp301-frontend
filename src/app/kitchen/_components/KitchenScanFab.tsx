"use client";

import Link from "next/link";
import { QrCodeIcon } from "@heroicons/react/24/solid";

/**
 * Nút nổi toàn kitchen: shortcut tới inbound (xác nhận hàng, nhãn QR).
 */
export default function KitchenScanFab() {
    return (
        <Link
            href="/kitchen/inbound"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-zinc-900 text-white shadow-lg transition hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            aria-label="Mở inbound — quét và xác nhận hàng về"
        >
            <QrCodeIcon className="h-7 w-7" aria-hidden />
        </Link>
    );
}
