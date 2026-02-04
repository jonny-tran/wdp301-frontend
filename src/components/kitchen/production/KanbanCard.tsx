"use client";
import React, { memo } from "react";
import { ClockIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Draggable } from "@hello-pangea/dnd";

export interface ProductionTask {
    id: string;
    title: string;
    quantity: string;
    assignee?: string;
    priority: "low" | "medium" | "high";
    startTime: string;
    status: "planned" | "prep" | "cooking" | "ready";
}

const priorityColors = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
};

export const KanbanCard = memo(({ task, index, dndEnabled = true }: { task: ProductionTask; index: number; dndEnabled?: boolean }) => {
    return (
        <Draggable draggableId={task.id} index={index} isDragDisabled={!dndEnabled}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        // Ép sử dụng GPU để di chuyển mượt hơn
                        willChange: snapshot.isDragging ? "transform" : "auto",
                    }}
                    className={`bg-white p-4 rounded-xl border select-none transition-shadow duration-200 ${snapshot.isDragging
                            ? "shadow-2xl ring-2 ring-blue-500 rotate-[2deg] z-50 border-transparent"
                            : "shadow-sm hover:shadow-md border-gray-100"
                        }`}
                >
                    <div className="flex justify-between items-start mb-2 pointer-events-none">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                        {task.priority === "high" && <ExclamationCircleIcon className="w-4 h-4 text-red-500" />}
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 mb-1 line-clamp-2 pointer-events-none">{task.title}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-3 pointer-events-none">{task.quantity}</p>
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 pointer-events-none">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>{task.startTime}</span>
                        </div>
                        {task.assignee && (
                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-white shadow-sm">
                                {task.assignee.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}, (prev, next) => {
    // Chỉ re-render khi các thuộc tính thực sự thay đổi vị trí hoặc dữ liệu
    return prev.task.id === next.task.id &&
        prev.task.status === next.task.status &&
        prev.index === next.index;
});

KanbanCard.displayName = "KanbanCard";