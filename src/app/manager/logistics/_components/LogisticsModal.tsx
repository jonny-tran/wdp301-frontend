/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleSchema, RouteSchema } from "@/schemas/logistics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Truck, MapPin } from "lucide-react";

interface Props {
  isOpen: boolean;
  type: "vehicles" | "routes";
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
  editingData?: any; // Bổ sung editingData vào Props
}

export default function LogisticsModal({
  isOpen,
  type,
  onClose,
  onSubmit,
  isPending,
  editingData, // Nhận dữ liệu chỉnh sửa
}: Props) {
  const schema = type === "vehicles" ? VehicleSchema : RouteSchema;

  // Gộp lại thành 1 khai báo duy nhất để tránh lỗi "Duplicate identifier 'form'"
  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      licensePlate: "",
      payloadCapacity: 0,
      fuelRatePerKm: "0.18",
      status: "available",
      routeName: "",
      distanceKm: 0,
      estimatedHours: 0,
      baseTransportCost: 0,
    },
  });

  // Đồng bộ dữ liệu khi mở Modal hoặc thay đổi Tab
  useEffect(() => {
    if (isOpen) {
      form.reset(
        editingData || {
          licensePlate: "",
          payloadCapacity: 0,
          fuelRatePerKm: "0.18",
          status: "available",
          routeName: "",
          distanceKm: 0,
          estimatedHours: 0,
          baseTransportCost: 0,
        },
      );
    }
  }, [isOpen, editingData, form, type]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-[2.5rem] border-none shadow-2xl p-8 overflow-visible">
        <DialogHeader className="relative">
          <div className="absolute -top-12 -left-4 bg-slate-900 text-white p-3 rounded-2xl rotate-3 shadow-xl">
            {type === "vehicles" ? (
              <Truck className="h-6 w-6 stroke-[2.5px]" />
            ) : (
              <MapPin className="h-6 w-6 stroke-[2.5px]" />
            )}
          </div>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-wider text-slate-900 mt-4">
            {type === "vehicles" ? "Khai báo Xe tải" : "Thêm Lộ trình"}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 italic">
            Cập nhật thông tin vào hệ thống vận hành Hậu Cần
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto pr-2 scrollbar-hide py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {type === "vehicles" ? (
                <>
                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                          Biển số xe
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="51H-123.45"
                            className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {/* Ví dụ cho ô Tải trọng */}
                    <FormField
                      control={form.control}
                      name="payloadCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                            Tải trọng (KG)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0} // Ngăn chặn nút bấm giảm xuống dưới 0
                              className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic"
                              {...field}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                // Nếu người dùng cố tình nhập số âm từ bàn phím, ép về 0 hoặc giữ nguyên số dương
                                field.onChange(val < 0 ? 0 : val);
                              }}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold italic ml-4 text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fuelRatePerKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                            Định mức (L/KM)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0.18"
                              className="rounded-full bg-slate-50 border-slate-100 h-12 px-6 font-black italic"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="routeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                          Tên tuyến đường
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Hub → Quận 1..."
                            className="rounded-full h-12 px-6 bg-slate-50 border-slate-100 font-black italic"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="distanceKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                            Cự ly (KM)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              className="rounded-full h-12 px-6 bg-slate-50 border-slate-100 font-black italic"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="baseTransportCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-2">
                            Giá gốc (VND)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="rounded-full h-12 px-6 bg-slate-50 border-slate-100 font-black italic"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Phần Trạng thái dùng chung cho cả 2 Tab hoặc đặt ở cuối xe tải */}
              {type === "vehicles" && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase italic text-slate-400 ml-4 tracking-[0.15em]">
                        TRẠNG THÁI
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-full bg-slate-50 border-slate-100 h-14 px-8 shadow-sm focus:ring-0 w-full! group">
                            <div
                              className={cn(
                                "font-black italic text-xl tracking-tighter lowercase first-letter:uppercase text-left w-full transition-colors",
                                field.value
                                  ? "text-slate-900"
                                  : "text-slate-300",
                              )}
                            >
                              <SelectValue placeholder="Sẵn sàng" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-[2.5rem] border-none bg-[#1A1A1A] text-white p-2 shadow-2xl z-[150]">
                          <SelectItem
                            value="available"
                            className="rounded-2xl font-black italic uppercase py-4 px-6 focus:bg-white/10 focus:text-white transition-all cursor-pointer"
                          >
                            SẴN SÀNG
                          </SelectItem>
                          <SelectItem
                            value="maintenance"
                            className="rounded-2xl font-black italic uppercase py-4 px-6 focus:bg-white/10 focus:text-white transition-all cursor-pointer text-red-400 focus:text-red-300"
                          >
                            BẢO TRÌ
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter className="pt-6 gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-full font-black uppercase italic text-[10px] text-slate-400 tracking-widest"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-slate-900 hover:bg-black text-white font-black uppercase italic text-[10px] tracking-[0.2em] px-10 h-12 shadow-xl active:scale-95 transition-all"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingData ? "Cập nhật dữ liệu" : "Kích hoạt dữ liệu"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
