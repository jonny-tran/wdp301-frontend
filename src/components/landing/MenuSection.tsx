import { BuildingStorefrontIcon, TruckIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function MenuSection() {
    const roles = [
        {
            name: "Central Kitchen",
            role: "Central Kitchen Staff",
            desc: "Receive orders, plan production, and manage ingredients & expiration dates.",
            icon: <BuildingStorefrontIcon className="w-8 h-8 text-primary" />
        },
        {
            name: "Supply Coordinator",
            role: "Supply Coordinator",
            desc: "Consolidate orders, coordinate production, and track shipment progress.",
            icon: <TruckIcon className="w-8 h-8 text-primary" />
        },
        {
            name: "Manager",
            role: "Operations Manager",
            desc: "Manage categories, recipes, inventory, and monitor system-wide performance.",
            icon: <ChartBarIcon className="w-8 h-8 text-primary" />
        },
        {
            name: "Admin",
            role: "System Administrator",
            desc: "Configure system settings, manage user permissions, and generate reports.",
            icon: <Cog6ToothIcon className="w-8 h-8 text-primary" />
        },
    ];

    return (
        <section className="w-full py-24 bg-white relative">
            <div className="container mx-auto px-6 text-center">
                <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] rounded-sm uppercase mb-4">
                    System Roles
                </span>
                <h2 className="text-4xl font-extrabold text-text-main mb-16 uppercase leading-tight">
                    Roles & <br />
                    <span className="text-primary italic">Functions</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {roles.map((item, idx) => (
                        <div key={idx} className="bg-bg-light rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-primary/20 group">
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 mx-auto group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>

                            <h3 className="text-lg font-extrabold text-text-main mb-2 uppercase">{item.role}</h3>
                            <span className="text-primary font-bold text-xs mb-4 block uppercase tracking-widest">{item.name}</span>
                            <p className="text-text-muted text-xs leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
