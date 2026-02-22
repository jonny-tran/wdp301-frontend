import InboundClient from "./_components/InboundClient";

export const metadata = {
    title: "Inbound Management | KFC Kitchen",
    description: "Manage incoming shipments and draft receipts.",
};

export default function InboundPage() {
    return <InboundClient />;
}
