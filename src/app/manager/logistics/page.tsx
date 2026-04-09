/* eslint-disable @typescript-eslint/no-explicit-any */
import LogisticsClient from "./_components/LogisticsClient";

export const metadata = {
  title: "Logistics Management | VFC System",
  description: "Hệ thống quản lý đội xe và tối ưu hóa tuyến đường vận chuyển",
};

export default function LogisticsPage() {
  return (
    <div className="p-4 md:p-8 lg:p-10 min-h-screen bg-transparent">
      {/* Container với animation mượt mà. 
          Max-width 1600px giúp giao diện không bị loãng trên màn hình UltraWide.
      */}
      <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-3 duration-500">
        <LogisticsClient />
      </div>
    </div>
  );
}
