"use client";

import { productionRequest } from "@/apiRequest/production";
import { handleErrorApi } from "@/lib/errors";
import {
    CompleteProductionBodyType,
    CreateRecipeApiBody,
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

    const startProductionOrder = useMutation({
        mutationFn: async (id: string) => {
            const res = await productionRequest.startOrder(id);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Đã bắt đầu lệnh — nguyên liệu đã được tạm giữ (FEFO)");
            void queryClient.invalidateQueries({ queryKey: KEY.production });
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
        },
    });

    const completeProductionOrder = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: CompleteProductionBodyType }) => {
            const res = await productionRequest.completeOrder(id, body);
            return res.data;
        },
        onSuccess: (data: CompleteProductionResult | unknown) => {
            const code = extractBatchCodeFromCompletePayload(data);
            toast.success(`Hoàn tất sản xuất — Mã lô mới: ${code}`);
            void queryClient.invalidateQueries({ queryKey: KEY.production });
            void queryClient.invalidateQueries({ queryKey: KEY.inventory });
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

    return {
        productionOrders,
        productionOrderDetail,
        productionRecipes,
        productionRecipeDetail,
        startProductionOrder,
        completeProductionOrder,
        createRecipe,
        updateRecipe,
        deleteRecipe,
    };
}
