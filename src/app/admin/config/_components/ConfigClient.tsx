"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { SystemConfig } from "./config.types";
import ConfigTable from "./ConfigTable";
import ConfigEditModal from "./ConfigEditModal";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function ConfigClient() {
  const queryClient = useQueryClient();
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch dữ liệu
  const { data, isLoading } = useQuery({
    queryKey: ["system-configs"],
    queryFn: () =>
      http.get<SystemConfig[]>("/system-configs").then((res) => res.data),
  });

  // 2. Mutation cập nhật
  const updateMutation = useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: any }) =>
      http.patch(`/system-configs/${key}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-configs"] });
      toast.success("Cấu hình hệ thống đã được cập nhật thành công!");
      setIsModalOpen(false);
    },
  });

  const handleSave = (key: string, value: string, description: string) => {
    updateMutation.mutate({ key, payload: { value, description } });
  };

  return (
    <div className="flex flex-col gap-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 px-1">
        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
          <Cog6ToothIcon className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Cấu hình hệ thống
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-1">
            Điều chỉnh tham số vận hành trung tâm
          </p>
        </div>
      </div>

      <div className="rounded-[3rem] border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="bg-slate-50/50 px-10 py-5 border-b border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
            Danh sách tham số Global
          </span>
        </div>

        <ConfigTable
          configs={data || []}
          onEdit={(cfg) => {
            setSelectedConfig(cfg);
            setIsModalOpen(true);
          }}
        />

        {isLoading && (
          <div className="py-20 text-center animate-pulse font-black text-slate-300">
            Đang truy xuất dữ liệu...
          </div>
        )}
      </div>

      <ConfigEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={selectedConfig}
        onSave={handleSave}
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
