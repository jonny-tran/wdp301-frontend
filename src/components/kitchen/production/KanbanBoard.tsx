"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { ProductionTask } from "./KanbanCard";

const COLUMNS = [
    { id: "planned", title: "Planned", color: "bg-gray-400" },
    { id: "prep", title: "In Prep", color: "bg-blue-500" },
    { id: "cooking", title: "Cooking", color: "bg-orange-500" },
    { id: "ready", title: "Ready", color: "bg-green-500" },
] as const;

export const KanbanBoard = ({ initialTasks }: { initialTasks: ProductionTask[] }) => {
    const [tasks, setTasks] = useState<ProductionTask[]>(initialTasks);
    const [enabled, setEnabled] = useState(false);

    // Fix hydration cho Next.js
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => cancelAnimationFrame(animation);
    }, []);

    // Tối ưu nhóm task (O(n))
    const tasksByStatus = useMemo(() => {
        const map: Record<string, ProductionTask[]> = { planned: [], prep: [], cooking: [], ready: [] };
        tasks.forEach(t => map[t.status]?.push(t));
        return map;
    }, [tasks]);

    const onDragEnd = useCallback((result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        setTasks((prev) => {
            const newTasks = [...prev];
            const taskIdx = newTasks.findIndex(t => t.id === draggableId);
            if (taskIdx === -1) return prev;

            // Tạo object mới để đảm bảo tính immutability cực đoan (giúp React so sánh nhanh hơn)
            const updatedTask = {
                ...newTasks[taskIdx],
                status: destination.droppableId as ProductionTask["status"]
            };

            // Xóa task cũ
            newTasks.splice(taskIdx, 1);

            // Tính toán vị trí chèn thực tế trong mảng phẳng dựa trên vị trí hiển thị trong cột
            const tasksInDestColumn = newTasks.filter(t => t.status === destination.droppableId);
            const targetInFlatArray = destination.index < tasksInDestColumn.length
                ? newTasks.findIndex(t => t.id === tasksInDestColumn[destination.index].id)
                : newTasks.length;

            newTasks.splice(targetInFlatArray === -1 ? newTasks.length : targetInFlatArray, 0, updatedTask);

            return newTasks;
        });
    }, []);

    if (!enabled) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-h-[500px] overflow-x-auto pb-4 items-stretch">
                {COLUMNS.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        color={col.color}
                        tasks={tasksByStatus[col.id]}
                    />
                ))}
            </div>
        </DragDropContext>
    );
};