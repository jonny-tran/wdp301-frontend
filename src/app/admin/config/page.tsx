import ConfigClient from "./_components/ConfigClient";

export const metadata = {
  title: "Cấu hình hệ thống | Mengo Admin",
  description: "Quản lý tham số vận hành Global",
};

export default function ConfigPage() {
  return (
    <main className="p-4 md:p-10">
      <ConfigClient />
    </main>
  );
}
