import ClaimsClient from "./_components/ClaimsClient";

export const metadata = {
  title: "Quản lý khiếu nại | Manager",
  description: "Hệ thống xử lý khiếu nại và thất thoát hàng hóa",
};

export default function ClaimsPage() {
  return (
    <main className="p-4 md:p-10">
      <ClaimsClient />
    </main>
  );
}
