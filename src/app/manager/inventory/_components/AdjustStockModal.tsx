"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InventoryAdjustBody, InventoryAdjustBodyType } from "@/schemas/inventory";
import { useInventory } from "@/hooks/useInventory";
import { handleErrorApi } from "@/lib/errors";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InventoryDisplayItem } from "./InventoryClient";

interface AdjustStockModalProps {
  item: InventoryDisplayItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdjustStockModal({ item, isOpen, onClose }: AdjustStockModalProps) {
  const { adjustInventory } = useInventory();

  const form = useForm<InventoryAdjustBodyType>({
    resolver: zodResolver(InventoryAdjustBody) as any,
    defaultValues: {
      batchId: 0,
      actualQuantity: 0,
      reasonCode: "DAMAGE",
      note: "",
    },
  });

  useEffect(() => {
    if (isOpen && item) {
      form.reset({
        batchId: 0,
        actualQuantity: 0,
        reasonCode: "DAMAGE",
        note: "",
      });
    }
  }, [isOpen, item, form]);

  const onSubmit = async (data: InventoryAdjustBodyType) => {
    try {
      await adjustInventory.mutateAsync(data);
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lệnh điều chỉnh tồn kho</DialogTitle>
          <DialogDescription>
            Sản phẩm: {item?.productName || "Không xác định"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="actualQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng thực tế</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-1 focus:ring-blue-400/50"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reasonCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do điều chỉnh</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900">
                        <SelectValue placeholder="Chọn lý do" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DAMAGE">Hư hỏng (DAMAGE)</SelectItem>
                      <SelectItem value="WASTE">Hao hụt / hủy (WASTE)</SelectItem>
                      <SelectItem value="PRODUCTION_WASTE">Hao hụt sản xuất (PRODUCTION_WASTE)</SelectItem>
                      <SelectItem value="INPUT_ERROR">Sai số nhập liệu (INPUT_ERROR)</SelectItem>
                      <SelectItem value="EXPIRED">Hết hạn (EXPIRED)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú thêm (Tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-1 focus:ring-blue-400/50"
                      placeholder="Chi tiết..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={adjustInventory.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={adjustInventory.isPending}>
                {adjustInventory.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
