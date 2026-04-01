"use client";

import { endOfDay, isWithinInterval, startOfDay } from "date-fns";
import { Activity, BookOpen, History, Package, Percent, Scale } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { productionRequest } from "@/apiRequest/production";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HttpError } from "@/lib/errors";
import {
    isOrderActiveStatus,
    isOrderCompletedStatus,
    listRowFromOrderDetail,
    parseCreatedProductionOrderId,
} from "@/lib/production-mapper";
import { useInventory } from "@/hooks/useInventory";
import { useProduction } from "@/hooks/useProduction";
import type { BaseResponsePagination } from "@/types/base";
import type { CompleteProductionResult, ProductionOrder, ProductionOrderDetail } from "@/types/production";
import { KEY, QUERY_KEY } from "@/utils/constant";
import CompleteProductionModal from "./CompleteProductionModal";
import PickingListModal from "./PickingListModal";
import ProductionCompleteSuccessModal from "./ProductionCompleteSuccessModal";
import ProductionOrderDetailDialog from "./ProductionOrderDetailDialog";
import ProductionOrderTable from "./ProductionOrderTable";
import RecipeDetail from "./RecipeDetail";
import RecipeList from "./RecipeList";

type MainTab = "orders" | "recipes" | "history";

type OrderStatusFilter = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";

const PAGINATION = { page: 1, limit: 200, sortOrder: "DESC" as const };

function normStatus(s: string) {
    return String(s ?? "").toUpperCase();
}

export default function ProductionClient() {
    const [mainTab, setMainTab] = useState<MainTab>("orders");
    const [recipeSearch, setRecipeSearch] = useState("");
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    const [completeOpen, setCompleteOpen] = useState(false);
    const [completeOrder, setCompleteOrder] = useState<ProductionOrder | null>(null);
    const [startingId, setStartingId] = useState<string | null>(null);
    const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatusFilter>("ALL");
    const [pickingOpen, setPickingOpen] = useState(false);
    const [pickingOrderId, setPickingOrderId] = useState<string | null>(null);
    const [pickingProductName, setPickingProductName] = useState("");
    const [completeSuccessOpen, setCompleteSuccessOpen] = useState(false);
    const [completeSuccessResult, setCompleteSuccessResult] = useState<CompleteProductionResult | null>(null);
    const [completeSuccessProductName, setCompleteSuccessProductName] = useState("");
    const [recipeFlowBusy, setRecipeFlowBusy] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const {
        productionOrders,
        productionRecipes,
        productionRecipeDetail,
        createProductionOrder,
        startProductionOrder,
        completeProductionOrder,
    } = useProduction();
    const { kitchenSummary } = useInventory();

    const applyDetailToOrderListCaches = useCallback(
        (orderId: string, detail: ProductionOrderDetail) => {
            const row = listRowFromOrderDetail(detail);
            queryClient.setQueriesData(
                {
                    predicate: (q) =>
                        Array.isArray(q.queryKey) && q.queryKey[0] === KEY.production[0] && q.queryKey[1] === "orders",
                },
                (old: BaseResponsePagination<ProductionOrder> | undefined) => {
                    if (!old?.items) return old;
                    return {
                        ...old,
                        items: old.items.map((o) =>
                            String(o.id) === String(orderId) ? { ...row, id: o.id, createdAt: o.createdAt } : o,
                        ),
                    };
                },
            );
        },
        [queryClient],
    );

    const syncProductionOrderRowFromDetail = async (orderId: string) => {
        const detail = await queryClient.fetchQuery({
            queryKey: QUERY_KEY.production.orderDetail(orderId),
            queryFn: async () => {
                const res = await productionRequest.getOrderDetail(orderId);
                return productionRequest.parseOrderDetailPayload(res.data);
            },
        });
        await queryClient.refetchQueries({
            predicate: (q) =>
                Array.isArray(q.queryKey) && q.queryKey[0] === KEY.production[0] && q.queryKey[1] === "orders",
        });
        applyDetailToOrderListCaches(orderId, detail);
    };

    const ordersQuery = productionOrders(PAGINATION);
    const recipesQuery = productionRecipes(PAGINATION, { enabled: mainTab === "recipes" });
    const recipeDetailQuery = productionRecipeDetail(selectedRecipeId, { enabled: mainTab === "recipes" && !!selectedRecipeId });

    const kitchenStockQuery = kitchenSummary(PAGINATION);

    const todayInterval = useMemo(() => {
        const now = new Date();
        return { start: startOfDay(now), end: endOfDay(now) };
    }, []);

    const allOrders = ordersQuery.data?.items ?? [];
    const orderItemsForSync = ordersQuery.data?.items;

    /** List GET thường thiếu `recipe.outputProduct` — bù tên/hàng từ GET chi tiết (không refetch cả list). */
    useEffect(() => {
        if (mainTab !== "orders" || !ordersQuery.isSuccess) return;
        const list = orderItemsForSync ?? [];
        const missing = list.filter((o) => o.productName === "—" || !String(o.productName ?? "").trim());
        if (missing.length === 0) return;
        let cancelled = false;
        const run = async () => {
            for (const o of missing.slice(0, 25)) {
                if (cancelled) break;
                try {
                    const res = await productionRequest.getOrderDetail(o.id);
                    const detail = productionRequest.parseOrderDetailPayload(res.data);
                    queryClient.setQueryData(QUERY_KEY.production.orderDetail(o.id), detail);
                    applyDetailToOrderListCaches(o.id, detail);
                } catch {
                    /* bỏ qua lệnh lỗi 404 */
                }
            }
        };
        void run();
        return () => {
            cancelled = true;
        };
    }, [mainTab, ordersQuery.isSuccess, orderItemsForSync, applyDetailToOrderListCaches, queryClient]);

    const filteredOrdersForTable = useMemo(() => {
        if (orderStatusFilter === "ALL") {
            return allOrders.filter((o) => {
                const u = normStatus(o.status);
                return u === "PENDING" || u === "IN_PROGRESS" || u === "COMPLETED";
            });
        }
        return allOrders.filter((o) => normStatus(o.status) === orderStatusFilter);
    }, [allOrders, orderStatusFilter]);

    const activeOrders = useMemo(() => {
        return allOrders.filter((o) => {
            if (!isOrderActiveStatus(o.status)) return false;
            const t = new Date(o.createdAt);
            return isWithinInterval(t, todayInterval);
        });
    }, [allOrders, todayInterval]);

    const historyOrders = useMemo(() => {
        return allOrders.filter((o) => isOrderCompletedStatus(o.status));
    }, [allOrders]);

    const recipes = recipesQuery.data?.items ?? [];
    const filteredRecipes = useMemo(() => {
        const q = recipeSearch.trim().toLowerCase();
        if (!q) return recipes;
        return recipes.filter(
            (r) =>
                r.productName.toLowerCase().includes(q) ||
                (r.sku && r.sku.toLowerCase().includes(q)),
        );
    }, [recipes, recipeSearch]);

    const stockByProductId = useMemo(() => {
        const m = new Map<number, number>();
        const rows = kitchenStockQuery.data?.items ?? [];
        rows.forEach((row) => {
            m.set(row.productId, row.availableQuantity);
        });
        return m;
    }, [kitchenStockQuery.data?.items]);

    const totalScheduledVolume = useMemo(() => {
        return activeOrders.reduce((sum, o) => sum + o.targetQuantity, 0);
    }, [activeOrders]);

    const pendingIngredientsCount = useMemo(() => {
        const rows = kitchenStockQuery.data?.items ?? [];
        return rows.filter((r) => r.isLowStock || r.availableQuantity <= 0).length;
    }, [kitchenStockQuery.data?.items]);

    const avgEfficiency = useMemo(() => {
        const done = historyOrders.filter(
            (o) => o.actualQuantity != null && o.actualQuantity > 0 && o.targetQuantity > 0,
        );
        if (done.length === 0) return null;
        const sum = done.reduce((acc, o) => acc + ((o.actualQuantity as number) / o.targetQuantity) * 100, 0);
        return Math.round((sum / done.length) * 10) / 10;
    }, [historyOrders]);

    const kpiCards = [
        {
            key: "vol",
            title: "Tổng khối lượng kế hoạch (hôm nay)",
            value: `${Math.round(totalScheduledVolume * 100) / 100}`,
            sub: "Tổng mục tiêu các lệnh active trong ngày",
            icon: Scale,
        },
        {
            key: "pending",
            title: "SKU nguyên liệu cảnh báo",
            value: String(pendingIngredientsCount),
            sub: "Tồn thấp / hết (theo tổng quan kho bếp)",
            icon: Package,
        },
        {
            key: "eff",
            title: "Hiệu suất sản xuất (Yield %)",
            value: avgEfficiency !== null ? `${avgEfficiency}%` : "—",
            sub: "Trung bình Actual/Target trên lệnh đã hoàn tất",
            icon: Percent,
        },
    ];

    const handleRecipeStartProduction = async (payload: {
        productId: number;
        productName: string;
        plannedQuantity: number;
    }) => {
        setRecipeFlowBusy(true);
        try {
            const raw = await createProductionOrder.mutateAsync({
                productId: payload.productId,
                plannedQuantity: payload.plannedQuantity,
            });
            const orderId = parseCreatedProductionOrderId(raw);
            if (!orderId) {
                toast.error("Tạo lệnh thành công nhưng không đọc được ID lệnh từ response — kiểm tra envelope API.");
                return;
            }
            await startProductionOrder.mutateAsync(orderId);
            await syncProductionOrderRowFromDetail(orderId);
            setPickingOrderId(orderId);
            setPickingProductName(payload.productName);
            setPickingOpen(true);
            setMainTab("orders");
        } catch (e) {
            const msg = e instanceof HttpError ? e.message : "Không thể tạo lệnh hoặc Start";
            toast.error(msg);
        } finally {
            setRecipeFlowBusy(false);
        }
    };

    const handleStart = async (id: string, productName: string) => {
        setStartingId(id);
        try {
            await startProductionOrder.mutateAsync(id);
            await syncProductionOrderRowFromDetail(id);
            setPickingOrderId(id);
            setPickingProductName(productName);
            setPickingOpen(true);
        } catch (e) {
            const msg = e instanceof HttpError ? e.message : "Không thể bắt đầu lệnh";
            toast.error(msg);
        } finally {
            setStartingId(null);
        }
    };

    const handleCompleteSubmit = (id: string, body: import("@/schemas/production").CompleteProductionBodyType) => {
        const name = completeOrder?.productName ?? "";
        completeProductionOrder.mutate(
            { id, body },
            {
                onSuccess: (data) => {
                    setCompleteOpen(false);
                    setCompleteOrder(null);
                    setCompleteSuccessResult(data);
                    setCompleteSuccessProductName(name);
                    setCompleteSuccessOpen(true);
                },
                onError: (e) => {
                    const msg = e instanceof HttpError ? e.message : "Không thể hoàn tất lệnh";
                    toast.error(msg);
                },
            },
        );
    };

    return (
        <div className="space-y-8 pb-10">
            <header className="border-b-4 border-zinc-900 pb-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">Central Kitchen</p>
                        <h1 className="mt-1 text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">
                            Điều độ sản xuất
                        </h1>
                        <p className="mt-2 max-w-2xl text-base font-medium text-zinc-600">
                            Wizard: <strong className="text-zinc-900">Lấy lô (FEFO)</strong> → Sản xuất →{" "}
                            <strong className="text-zinc-900">Ghi nhận thành phẩm</strong>. Nút lớn, tương phản cao cho
                            kiosk bếp.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border-2 border-zinc-800 bg-zinc-900 px-4 py-2 text-white">
                        <Activity className="size-6 text-amber-400" aria-hidden />
                        <span className="text-sm font-bold uppercase tracking-wide">Production</span>
                    </div>
                </div>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
                {kpiCards.map((k) => (
                    <Card
                        key={k.key}
                        className="border-2 border-zinc-800 bg-white shadow-[4px_4px_0_0_rgb(24_24_27)]"
                    >
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <span className="text-sm font-bold uppercase tracking-wide text-zinc-500">{k.title}</span>
                            <k.icon className="size-6 text-amber-600" aria-hidden />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-black tabular-nums text-zinc-950">{k.value}</p>
                            <p className="mt-2 text-sm font-medium text-zinc-600">{k.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <div className="flex flex-wrap gap-2 border-b-4 border-zinc-900 pb-1">
                {(
                    [
                        { id: "orders" as const, label: "Active Orders", icon: Activity },
                        { id: "recipes" as const, label: "Recipe Book", icon: BookOpen },
                        { id: "history" as const, label: "Production History", icon: History },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setMainTab(tab.id)}
                        className={`flex min-h-[52px] items-center gap-2 rounded-t-lg border-2 border-b-0 px-6 text-base font-bold transition-colors ${
                            mainTab === tab.id
                                ? "border-zinc-900 bg-zinc-900 text-white"
                                : "border-transparent bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                        }`}
                    >
                        <tab.icon className="size-5" aria-hidden />
                        {tab.label}
                    </button>
                ))}
            </div>

            {mainTab === "orders" && (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {(
                            [
                                { id: "ALL" as const, label: "Tất cả" },
                                { id: "PENDING" as const, label: "PENDING" },
                                { id: "IN_PROGRESS" as const, label: "IN_PROGRESS" },
                                { id: "COMPLETED" as const, label: "COMPLETED" },
                            ] as const
                        ).map((chip) => (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => setOrderStatusFilter(chip.id)}
                                className={`min-h-[48px] rounded-lg border-2 px-5 text-sm font-black uppercase tracking-wide transition-colors ${
                                    orderStatusFilter === chip.id
                                        ? "border-zinc-900 bg-zinc-900 text-white"
                                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                                }`}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-zinc-600">
                        Bấm vào một dòng lệnh để xem chi tiết (FEFO, lô TP, nhật ký kho).
                    </p>
                    <ProductionOrderTable
                        orders={filteredOrdersForTable}
                        isLoading={ordersQuery.isLoading}
                        mode="active"
                        startingId={startingId}
                        onStart={handleStart}
                        onCompleteClick={(o) => {
                            setCompleteOrder(o);
                            setCompleteOpen(true);
                        }}
                        onDetailClick={(o) => {
                            setDetailOrderId(o.id);
                            setDetailOpen(true);
                        }}
                    />
                </div>
            )}

            {mainTab === "history" && (
                <>
                    <p className="text-sm font-medium text-zinc-600">
                        Bấm vào dòng để xem chi tiết lệnh đã hoàn tất.
                    </p>
                    <ProductionOrderTable
                        orders={historyOrders}
                        isLoading={ordersQuery.isLoading}
                        mode="history"
                        startingId={null}
                        onStart={() => {}}
                        onCompleteClick={() => {}}
                        onDetailClick={(o) => {
                            setDetailOrderId(o.id);
                            setDetailOpen(true);
                        }}
                    />
                </>
            )}

            {mainTab === "recipes" && (
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <RecipeList
                        recipes={filteredRecipes}
                        isLoading={recipesQuery.isLoading}
                        search={recipeSearch}
                        onSearchChange={setRecipeSearch}
                        selectedId={selectedRecipeId}
                        onSelect={setSelectedRecipeId}
                    />
                    <RecipeDetail
                        detail={recipeDetailQuery.data ?? null}
                        isLoading={recipeDetailQuery.isLoading}
                        stockByProductId={stockByProductId}
                        onStartProduction={handleRecipeStartProduction}
                        isStarting={recipeFlowBusy}
                    />
                </div>
            )}

            <CompleteProductionModal
                order={completeOrder}
                open={completeOpen}
                onOpenChange={(o) => {
                    setCompleteOpen(o);
                    if (!o) setCompleteOrder(null);
                }}
                onSubmit={handleCompleteSubmit}
                isSubmitting={completeProductionOrder.isPending}
            />

            <PickingListModal
                open={pickingOpen}
                onOpenChange={(o) => {
                    setPickingOpen(o);
                    if (!o) {
                        setPickingOrderId(null);
                        setPickingProductName("");
                    }
                }}
                orderId={pickingOrderId}
                productName={pickingProductName}
            />

            <ProductionCompleteSuccessModal
                open={completeSuccessOpen}
                onOpenChange={(o) => {
                    setCompleteSuccessOpen(o);
                    if (!o) setCompleteSuccessResult(null);
                }}
                result={completeSuccessResult}
                productName={completeSuccessProductName}
            />

            <ProductionOrderDetailDialog
                open={detailOpen}
                onOpenChange={(o) => {
                    setDetailOpen(o);
                    if (!o) setDetailOrderId(null);
                }}
                orderId={detailOrderId}
            />
        </div>
    );
}
