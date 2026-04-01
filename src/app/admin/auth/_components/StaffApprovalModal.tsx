/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Store as StoreIcon, User, Info } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function StaffApprovalModal({
  isOpen,
  onClose,
  data,
  onApprove,
  onReject,
  isProcessing,
}: any) {
  // Nhóm nhân viên theo StoreId
  const groupedStaff = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc: any, staff: any) => {
      const storeName = staff.store?.name || "Chi nhánh không xác định";
      if (!acc[storeName]) acc[storeName] = [];
      acc[storeName].push(staff);
      return acc;
    }, {});
  }, [data]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl rounded-[2.5rem] border-none shadow-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-wider text-slate-900">
            Phê duyệt nhân sự
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-hide py-4">
          {Object.keys(groupedStaff).length === 0 ? (
            <p className="text-center py-10 font-bold italic text-slate-400">
              Không có yêu cầu nào đang chờ
            </p>
          ) : (
            Object.entries(groupedStaff).map(([storeName, staffList]: any) => (
              <div key={storeName} className="space-y-4">
                <div className="flex items-center gap-2 border-l-4 border-slate-900 pl-4">
                  <StoreIcon className="h-4 w-4" />
                  <h3 className="font-black uppercase italic text-sm text-slate-900">
                    {storeName}
                  </h3>
                  <span className="bg-slate-100 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {staffList.length}
                  </span>
                </div>

                <div className="grid gap-3 ml-4">
                  {staffList.map((staff: any) => (
                    <div
                      key={staff.id}
                      className="bg-slate-50 p-4 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 uppercase">
                          {staff.username.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase italic leading-none mb-1">
                            {staff.username}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 italic">
                            {staff.phone} • {staff.staffRequestNote}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white text-emerald-600 hover:bg-emerald-50"
                          onClick={() => onApprove(staff.id)}
                          disabled={isProcessing}
                        >
                          <Check className="h-4 w-4 stroke-[3px]" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full bg-white text-red-500 hover:bg-red-50"
                          onClick={() => {
                            const reason = prompt("Lý do từ chối?");
                            if (reason) onReject(staff.id, reason);
                          }}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4 stroke-[3px]" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
