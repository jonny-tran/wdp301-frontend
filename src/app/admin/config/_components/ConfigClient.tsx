"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endponit";
import ConfigTable from "./ConfigTable";
import ConfigEditModal from "./ConfigEditModal";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

export interface UpdateConfigPayload {
  value: string;
  description: string;
}

export default function ConfigClient() {
  const queryClient = useQueryClient();
  const [selectedConfig, setSelectedConfig] = useState<SystemConfig | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch dữ liệu — http wrapper đã extract data từ ResponseData<T>
  const { data, isLoading } = useQuery({
    queryKey: ["system-configs"],
    queryFn: () =>
      http
        .get<SystemConfig[]>(ENDPOINT_CLIENT.SYSTEM_CONFIGS)
        .then((res) => {
          // res.data chính là payload thực tế (T) — http.ts đã unwrap ResponseData
          return Array.isArray(res.data) ? res.data : [];
        }),
  });

  // 2. Mutation cập nhật — FIX: URL không còn spaces
  const updateMutation = useMutation({
    mutationFn: ({
      key,
      payload,
    }: {
      key: string;
      payload: UpdateConfigPayload;
    }) => http.patch(ENDPOINT_CLIENT.UPDATE_SYSTEM_CONFIG(key), payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-configs"] });
      toast.success("Cấu hình hệ thống đã được cập nhật thành công!");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Cập nhật cấu hình thất bại. Vui lòng thử lại.");
    },
  });

  const handleSave = (key: string, value: string, description: string) => {
    updateMutation.mutate({ key, payload: { value, description } });
  };

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-1">
        <div className="p-2.5 bg-primary rounded-2xl shadow-lg shadow-primary/20">
          <Cog6ToothIcon className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 leading-none">
            Cấu hình hệ thống
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Điều chỉnh tham số vận hành trung tâm
          </p>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-2xl border border-slate-100 bg-white shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Danh sách tham số Global ({data?.length ?? 0} tham số)
          </span>
        </div>

        <ConfigTable
          configs={data || []}
          isLoading={isLoading}
          onEdit={(cfg) => {
            setSelectedConfig(cfg);
            setIsModalOpen(true);
          }}
        />
      </div>

      {/* EDIT MODAL */}
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
