"use client";
import { KanbanBoard } from "@/components/kitchen/production/KanbanBoard";
import { ProductionTask } from "@/components/kitchen/production/KanbanCard";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

export default function ProductionPlanClient() {
    // Mock Data
    const tasks: ProductionTask[] = [
        { id: "1", title: "Marinate Chicken Wings (Batch #201)", quantity: "50 kg", priority: "high", startTime: "08:00 AM", status: "prep", assignee: "John" },
        { id: "2", title: "Prepare Spicy Coating Mix", quantity: "20 kg", priority: "medium", startTime: "08:30 AM", status: "prep", assignee: "Sarah" },
        { id: "3", title: "Fry Batch #199 (Thighs)", quantity: "30 kg", priority: "high", startTime: "07:45 AM", status: "cooking", assignee: "Mike" },
        { id: "4", title: "Pack Order #1023 (Franchise A)", quantity: "150 units", priority: "medium", startTime: "09:00 AM", status: "planned" },
        { id: "5", title: "Quality Check Batch #198", quantity: "40 kg", priority: "low", startTime: "07:30 AM", status: "ready", assignee: "Lisa" },
        { id: "6", title: "Defrost Chicken Breasts", quantity: "100 kg", priority: "medium", startTime: "10:00 AM", status: "planned" },
        { id: "7", title: "Mix Signature Sauce", quantity: "50 L", priority: "high", startTime: "09:15 AM", status: "prep", assignee: "John" },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Adjusted height to fit within layout main area */}

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-text-main">Production Plan</h2>
                    <p className="text-xs text-text-muted">Manage daily kitchen tasks and workflow</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-text-muted hover:border-primary hover:text-primary transition-colors">
                        <FunnelIcon className="w-5 h-5" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                        <PlusIcon className="w-5 h-5" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Kanban Board Container */}
            <div className="flex-1 overflow-hidden">
                <KanbanBoard initialTasks={tasks} />
            </div>
        </div>
    );
}
