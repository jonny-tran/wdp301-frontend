"use client";
import React, { memo } from "react";
import { PlusIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard, ProductionTask } from "./KanbanCard";

export const KanbanColumn = memo(({ id, title, tasks, color }: { id: string; title: string; tasks: ProductionTask[]; color: string }) => {
    return (
        <div className="flex-1 min-w-[320px] max-w-[400px] flex flex-col h-full bg-gray-50/50 rounded-[2rem] p-4 border border-gray-100">
            <div className="flex items-center justify-between px-2 mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wide">{title}</h3>
                    <span className="bg-white text-xs font-bold px-2 py-0.5 rounded-full border border-gray-100 text-gray-500">{tasks.length}</span>
                </div>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-white rounded-lg text-gray-400"><PlusIcon className="w-5 h-5" /></button>
                    <button className="p-1 hover:bg-white rounded-lg text-gray-400"><EllipsisHorizontalIcon className="w-5 h-5" /></button>
                </div>
            </div>

            <Droppable droppableId={id} type="TASK">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 overflow-y-auto px-1 custom-scrollbar transition-colors duration-200 rounded-xl ${snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                            }`}
                    >
                        <div className="space-y-3 min-h-[150px]">
                            {tasks.map((task, index) => (
                                <KanbanCard key={task.id} task={task} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    </div>
                )}
            </Droppable>
        </div>
    );
});

KanbanColumn.displayName = "KanbanColumn";