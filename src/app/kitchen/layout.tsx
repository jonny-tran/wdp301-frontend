import Sidebar from "@/components/dashboard/ui/Sidebar";
import Header from "@/components/dashboard/ui/Header";

export default function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-bg-light font-sans text-text-main">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col relative">
                <Header />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
