"use client";

import { useEffect, useMemo } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { productRequest } from "@/apiRequest/product";
import { useProduct } from "@/hooks/useProduct";
import { useProduction } from "@/hooks/useProduction";
import {
  Product,
  ProductType,
  getProductBaseUnitDisplay,
} from "@/types/product";
import { QUERY_KEY } from "@/utils/constant";
import {
  CreateRecipeFormSchema,
  type CreateRecipeFormValues,
  type CreateRecipeApiBody,
  type UpdateRecipeApiBody,
} from "@/schemas/production";
import { handleErrorApi } from "@/lib/errors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function unwrapProductRows(data: unknown): Product[] {
  if (data == null) return [];
  const r = data as Record<string, unknown>;
  if (Array.isArray(r.data)) return r.data as Product[];
  if (Array.isArray(r.items)) return r.items as Product[];
  if (Array.isArray(data)) return data as Product[];
  return [];
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** null = tạo mới */
  recipeId: string | null;
};

export default function RecipeFormModal({ open, onClose, recipeId }: Props) {
  const isEdit = !!recipeId;
  const { productList } = useProduct();
  const { createRecipe, updateRecipe, productionRecipeDetail } =
    useProduction();

  const recipeDetailQuery = productionRecipeDetail(recipeId, {
    enabled: open && isEdit,
  });

  const finishedQuery = productList({
    page: 1,
    limit: 500,
    sortOrder: "ASC",
    search: "",
    type: ProductType.FINISHED_GOOD,
    isActive: true,
  });

  const rawQuery = productList({
    page: 1,
    limit: 500,
    sortOrder: "ASC",
    search: "",
    type: ProductType.RAW_MATERIAL,
    isActive: true,
  });

  const finishedProducts = useMemo(
    () =>
      unwrapProductRows(finishedQuery.data).filter((p) => p.isActive !== false),
    [finishedQuery.data],
  );
  const rawProducts = useMemo(
    () => unwrapProductRows(rawQuery.data).filter((p) => p.isActive !== false),
    [rawQuery.data],
  );

  const rawById = useMemo(() => {
    const m = new Map<number, Product>();
    rawProducts.forEach((p) => m.set(p.id, p));
    return m;
  }, [rawProducts]);

  const form = useForm<CreateRecipeFormValues>({
    resolver: zodResolver(
      CreateRecipeFormSchema,
    ) as Resolver<CreateRecipeFormValues>,
    defaultValues: {
      outputProductId: 0,
      standardOutput: 1,
      items: [{ productId: 0, quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const outputId = form.watch("outputProductId");

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      form.reset({
        outputProductId: 0,
        standardOutput: 1,
        items: [{ productId: 0, quantity: 1 }],
      });
      return;
    }
    const d = recipeDetailQuery.data;
    if (!d) return;
    form.reset({
      outputProductId: d.productId,
      standardOutput: 1,
      items:
        d.bom.length > 0
          ? d.bom.map((l) => ({
              productId: l.ingredientProductId,
              quantity: l.standardQuantity,
            }))
          : [{ productId: 0, quantity: 1 }],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset theo payload chi tiết, không theo form object
  }, [open, isEdit, recipeDetailQuery.data]);

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
    defaultValue: [],
  });

  const materialIds = useMemo(() => {
    const set = new Set<number>();
    for (const row of watchedItems ?? []) {
      if (row?.productId > 0) set.add(row.productId);
    }
    return [...set].sort((a, b) => a - b);
  }, [watchedItems]);

  const ingredientDetailQueries = useQueries({
    queries: materialIds.map((id) => ({
      queryKey: QUERY_KEY.products.detail(id),
      queryFn: async () => {
        const res = await productRequest.getProductDetail(id);
        return res.data;
      },
      enabled: open && id > 0,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const detailById = useMemo(() => {
    const m = new Map<number, Product>();
    materialIds.forEach((id, i) => {
      const row = ingredientDetailQueries[i]?.data;
      if (row && typeof row === "object" && "id" in row) {
        m.set(id, row as Product);
      }
    });
    return m;
  }, [materialIds, ingredientDetailQueries]);

  const saving = createRecipe.isPending || updateRecipe.isPending;
  const loadingEdit = isEdit && recipeDetailQuery.isLoading;

  const onSubmit = async (values: CreateRecipeFormValues) => {
    const so = values.standardOutput;
    const itemsPayload = values.items.map((row) => ({
      productId: row.productId,
      quantity: row.quantity / so,
    }));

    try {
      if (isEdit && recipeId) {
        const body: UpdateRecipeApiBody = {
          productId: values.outputProductId,
          items: itemsPayload,
        };
        await updateRecipe.mutateAsync({ id: recipeId, body });
      } else {
        const apiBody: CreateRecipeApiBody = {
          productId: values.outputProductId,
          items: itemsPayload,
        };
        await createRecipe.mutateAsync(apiBody);
      }
      form.reset({
        outputProductId: 0,
        standardOutput: 1,
        items: [{ productId: 0, quantity: 1 }],
      });
      onClose();
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Sửa công thức (BOM)" : "Tạo công thức (BOM)"}
          </DialogTitle>
          <DialogDescription>
            Định mức gửi API là trên 1 đơn vị thành phẩm (quy đổi từ tổng nhập
            cho sản lượng chuẩn).
          </DialogDescription>
        </DialogHeader>

        {loadingEdit ? (
          <div className="space-y-3 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 pr-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="outputProductId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Thành phẩm đầu ra{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                        disabled={finishedQuery.isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 w-full text-slate-900 focus:ring-offset-0 focus:ring-0">
                            <div className="text-slate-900 font-medium">
                              <SelectValue placeholder="Chọn thành phẩm (finished_good)" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="z-[200] max-h-60"
                        >
                          {finishedProducts.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} ({p.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="standardOutput"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Sản lượng chuẩn (đơn vị đầu ra){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          min={0.0001}
                          className="bg-slate-50 border-slate-200"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.valueAsNumber || Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-[11px] text-slate-500">
                        Số lượng nguyên liệu mỗi dòng là{" "}
                        <strong>tổng cho {field.value || "—"}</strong> đơn vị
                        thành phẩm.
                      </p>
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel>Nguyên liệu</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => append({ productId: 0, quantity: 1 })}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Thêm dòng
                    </Button>
                  </div>

                  {fields.map((f, index) => {
                    const pid = form.watch(`items.${index}.productId`);
                    const mat = pid ? rawById.get(pid) : undefined;
                    const detail = pid ? detailById.get(pid) : undefined;
                    const listUnit = getProductBaseUnitDisplay(mat);
                    const unitFromDetail = detail
                      ? getProductBaseUnitDisplay(detail)
                      : "—";
                    const detailIdx = pid ? materialIds.indexOf(pid) : -1;
                    const detailLoading =
                      pid > 0 &&
                      detailIdx >= 0 &&
                      ingredientDetailQueries[detailIdx]?.isLoading;
                    const unitLabel = detailLoading
                      ? "Đang tải…"
                      : unitFromDetail !== "—"
                        ? unitFromDetail
                        : listUnit;

                    return (
                      <div
                        key={f.id}
                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-3"
                      >
                        <div className="flex justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Dòng {index + 1}
                          </span>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`items.${index}.productId`}
                          render={({ field: rowField }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Nguyên liệu
                              </FormLabel>
                              <Select
                                value={
                                  rowField.value ? String(rowField.value) : ""
                                }
                                onValueChange={(v) =>
                                  rowField.onChange(Number(v))
                                }
                                disabled={rawQuery.isLoading}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white border-slate-200">
                                    <SelectValue placeholder="Chọn NL (raw_material)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent
                                  position="popper"
                                  className="z-[200] max-h-60"
                                >
                                  {rawProducts
                                    .filter((p) => p.id !== outputId)
                                    .map((p) => (
                                      <SelectItem
                                        key={p.id}
                                        value={String(p.id)}
                                      >
                                        {p.name} ({p.sku})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field: qField }) => (
                              <FormItem>
                                <FormLabel className="text-xs">
                                  Số lượng
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="any"
                                    min={0.0001}
                                    className="bg-white border-slate-200"
                                    {...qField}
                                    onChange={(e) =>
                                      qField.onChange(
                                        e.target.valueAsNumber ||
                                          Number(e.target.value),
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormItem>
                            <FormLabel className="text-xs">
                              Đơn vị (theo NL)
                            </FormLabel>
                            <Input
                              readOnly
                              value={unitLabel}
                              className="bg-slate-100 border-slate-200 text-slate-700"
                            />
                          </FormItem>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={saving}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEdit ? "Cập nhật" : "Lưu công thức"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
