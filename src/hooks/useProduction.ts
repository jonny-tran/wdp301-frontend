"use client";

import { productionRequest } from "@/apiRequest/production";
import { handleErrorApi } from "@/lib/errors";
import {
    CancelProductionOrderBodySchema,
    CancelProductionOrderBodyType,
    CompleteProductionBodyType,
    CompleteSalvageBodySchema,
    CompleteSalvageBodyType,
    CreateProductionOrderBodyType,
    CreateRecipeApiBody,
    CreateSalvageBodySchema,
    CreateSalvageBodyType,
    UpdateRecipeApiBody,
} from "@/schemas/production";
import type {
    CompleteProductionResult,
    QueryProductionOrder,
    QueryRecipeList,
} from "@/types/production";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function extractBatchCodeFromCompletePayload(data: unknown): string {
    if (data && typeof data === "object") {
        const o = data as Record<string, unknown>;
        if (o.batchCode != null) return String(o.batchCode);
        const inner = o.data;
        if (inner && typeof inner === "object") {
            const c = (inner as Record<string, unknown>).batchCode;
            if (c != null) return String(c);
        }
    }
    return "—";
}

function normalizeCompleteProductionResult(data: unknown): CompleteProductionResult {
    const root = (data ?? {}) as Record<string, unknown>;
    const inner = (root.data ?? root) as Record<string, unknown>;
    const batchId = Number(inner.batchId ?? inner.id ?? root.batchId);
    const batchCode = String(inner.batchCode ?? root.batchCode ?? "");
    const outputExpiryDate = inner.outputExpiryDate ?? inner.expiryDate ?? root.outputExpiryDate ?? root.expiryDate;
    return {
        batchId: Number.isFinite(batchId) ? batchId : 0,
        batchCode: batchCode || extractBatchCodeFromCompletePayload(data),
        message: inner.message != null ? String(inner.message) : root.message != null ? String(root.message) : undefined,
        outputExpiryDate: outputExpiryDate != null ? String(outputExpiryDate) : undefined,
        expiryDate: inner.expiryDate != null ? String(inner.expiryDate) : undefined,
    };
}

export function useProduction() {
    const queryClient = useQueryClient();

    const productionOrders = (query: QueryProductionOrder, options?: { enabled?: boolean }) =>
        useQuery({
            queryKey: QUERY_KEY.production.orders(query),
            queryFn: async () => {
                const res = await productionRequest.getOrders(query);
                return productionRequest.parseOrdersPage(res.data, query);
            },
            enabled: options?.enabled !== false,
        });

    const productionRecipes = (query: QueryRecipeList, options?: { enabled?: boolean }) =>
        useQuery({
            queryKey: QUERY_KEY.production.recipes(query),
            queryFn: async () => {
                const res = await productionRequest.getRecipes(query);
                return productionRequest.parseRecipesPage(res.data, query);
            },
            enabled: options?.enabled !== false,
        });

    const productionOrderDetail = (orderId: string | null, options?: { enabled?: boolean }) =>
        useQuery({
            queryKey: orderId ? QUERY_KEY.production.orderDetail(orderId) : ["production", "order", "idle"],
            queryFn: async () => {
                if (!orderId) throw new Error("missing order id");
                const res = await productionRequest.getOrderDetail(orderId);
                return productionRequest.parseOrderDetailPayload(res.data);
            },
            enabled: (options?.enabled !== false) && !!orderId,
        });

    const productionRecipeDetail = (recipeId: string | null, options?: { enabled?: boolean }) =>
        useQuery({
            queryKey: recipeId ? QUERY_KEY.production.recipeDetail(recipeId) : ["production", "recipe", "idle"],
            queryFn: async () => {
                if (!recipeId) throw new Error("missing recipe id");
                const res = await productionRequest.getRecipeDetail(recipeId);
                return productionRequest.parseRecipeDetailPayload(res.data);
            },
            enabled: (options?.enabled !== false) && !!recipeId,
        });

    const createProductionOrder = useMutation({
        mutationFn: async (body: CreateProductionOrderBodyType) => {
            const res = await productionRequest.createOrder(body);
            return res.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: KEY.production });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const startProductionOrder = useMutation({
        mutationFn: async (id: string) => {
            const res = await productionRequest.startOrder(id);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã bắt đầu lệnh — nguyên liệu đã được tạm giữ (FEFO)");
            /** Danh sách lệnh + tên SP: ProductionClient refetch & merge từ GET /orders/:id để khớp payload Nest. */
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
    });

    const completeProductionOrder = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: CompleteProductionBodyType }) => {
            const res = await productionRequest.completeOrder(id, body);
            return normalizeCompleteProductionResult(res.data);
        },
        onSuccess: (data: CompleteProductionResult) => {
            const code = data.batchCode || "—";
            toast.success(`Hoàn tất sản xuất — Mã lô mới: ${code}`);
            void queryClient.invalidateQueries({ queryKey: KEY.production });
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
    });

    const cancelProductionOrder = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: CancelProductionOrderBodyType }) => {
            const parsed = CancelProductionOrderBodySchema.parse(body);
            const res = await productionRequest.cancelOrder(id, parsed);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã từ chối lệnh sản xuất");
            void queryClient.invalidateQueries({ queryKey: KEY.production });
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const createRecipe = useMutation({
        mutationFn: async (body: CreateRecipeApiBody) => {
            const res = await productionRequest.createRecipe(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã tạo công thức (BOM)");
            void queryClient.invalidateQueries({ queryKey: KEY.production });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const updateRecipe = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: UpdateRecipeApiBody }) => {
            const res = await productionRequest.updateRecipe(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã cập nhật công thức");
            void queryClient.invalidateQueries({ queryKey: KEY.production });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const deleteRecipe = useMutation({
        mutationFn: async (id: string) => {
            const res = await productionRequest.deleteRecipe(id);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã ngừng công thức");
            void queryClient.invalidateQueries({ queryKey: KEY.production });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const createSalvageOrder = useMutation({
        mutationFn: async (body: CreateSalvageBodyType) => {
            const parsed = CreateSalvageBodySchema.parse(body);
            const res = await productionRequest.createSalvage(parsed);
            const id = productionRequest.parseSalvageCreatedOrderId(res.data);
            return { raw: res.data, orderId: id };
        },
        onSuccess: () => {
            toast.success("Đã tạo lệnh salvage — hoàn tất để nhập lô thành phẩm");
            void queryClient.invalidateQueries({ queryKey: KEY.production });
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const completeSalvageOrder = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: CompleteSalvageBodyType }) => {
            const parsed = CompleteSalvageBodySchema.parse(body);
            const res = await productionRequest.completeSalvage(id, parsed);
            return normalizeCompleteProductionResult(res.data);
        },
        onSuccess: (data: CompleteProductionResult) => {
            const code = data.batchCode || "—";
            toast.success(`Hoàn tất salvage — Lô TP: ${code}`);
            void queryClient.invalidateQueries({ queryKey: KEY.production });
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    return {
        productionOrders,
        productionOrderDetail,
        productionRecipes,
        productionRecipeDetail,
        createProductionOrder,
        startProductionOrder,
        cancelProductionOrder,
        completeProductionOrder,
        createRecipe,
        updateRecipe,
        deleteRecipe,
        createSalvageOrder,
        completeSalvageOrder,
    };
}
