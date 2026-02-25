import ShipmentClient from "./_components/ShipmentClient";

export const metadata = {
  title: "Shipment Management | Manager Portal",
  description: "Quản lý và theo dõi lộ trình vận chuyển đơn hàng",
};

export default function ShipmentPage() {
  return (
    <main className="p-6 lg:p-10 min-h-screen bg-slate-50/30">
      <ShipmentClient />
    </main>
  );
}
