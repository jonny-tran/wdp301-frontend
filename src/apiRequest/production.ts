import http from "@/lib/http";
import {
    normalizeProductionOrder,
    normalizeRecipeDetail,
    normalizeRecipeSummary,
    parseProductionOrderDetailPayload,
} from "@/lib/production-mapper";
import {
    CompleteProductionBodyType,
    CreateProductionOrderBodyType,
    CreateRecipeApiBody,
    UpdateRecipeApiBody,
} from "@/schemas/production";
import { BaseResponsePagination } from "@/types/base";
import type {
    CompleteProductionResult,
    ProductionOrder,
    ProductionOrderDetail,
    QueryProductionOrder,
    QueryRecipeList,
    RecipeDetail,
    RecipeSummary,
} from "@/types/production";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

function parsePaginatedProduction(raw: unknown, query: QueryProductionOrder): BaseResponsePagination<ProductionOrder> {
    const payload = (raw ?? {}) as Record<string, unknown>;
    const itemsRaw = payload.items ?? payload.data;
    const items = Array.isArray(itemsRaw)
        ? itemsRaw.map((row) => normalizeProductionOrder(row as Record<string, unknown>))
        : [];
    const meta = payload.meta as BaseResponsePagination<ProductionOrder>["meta"] | undefined;
    return {
        items,
        meta: meta ?? {
            totalItems: items.length,
            itemCount: items.length,
            itemsPerPage: query.limit,
            totalPages: Math.max(1, Math.ceil(items.length / query.limit) || 1),
            currentPage: query.page,
        },
    };
}

function parsePaginatedRecipes(raw: unknown, query: QueryRecipeList): BaseResponsePagination<RecipeSummary> {
    const payload = (raw ?? {}) as Record<string, unknown>;
    const itemsRaw = payload.items ?? payload.data;
    const items = Array.isArray(itemsRaw)
        ? itemsRaw.map((row) => normalizeRecipeSummary(row as Record<string, unknown>))
        : [];
    const meta = payload.meta as BaseResponsePagination<RecipeSummary>["meta"] | undefined;
    return {
        items,
        meta: meta ?? {
            totalItems: items.length,
            itemCount: items.length,
            itemsPerPage: query.limit,
            totalPages: Math.max(1, Math.ceil(items.length / query.limit) || 1),
            currentPage: query.page,
        },
    };
}

export const productionRequest = {
    getOrders: (query: QueryProductionOrder) => http.get<unknown>(ENDPOINT_CLIENT.PRODUCTION_ORDERS, { query }),

    createOrder: (body: CreateProductionOrderBodyType) =>
        http.post<unknown>(ENDPOINT_CLIENT.PRODUCTION_ORDERS, body),

    getOrderDetail: (id: string) => http.get<unknown>(ENDPOINT_CLIENT.PRODUCTION_ORDER_DETAIL(id)),

    getRecipes: (query: QueryRecipeList) => http.get<unknown>(ENDPOINT_CLIENT.PRODUCTION_RECIPES, { query }),

    getRecipeDetail: (id: string) => http.get<unknown>(ENDPOINT_CLIENT.PRODUCTION_RECIPE_DETAIL(id)),

    startOrder: (id: string) => http.post<ProductionOrder>(ENDPOINT_CLIENT.PRODUCTION_ORDER_START(id), {}),

    completeOrder: (id: string, body: CompleteProductionBodyType) =>
        http.post<CompleteProductionResult>(ENDPOINT_CLIENT.PRODUCTION_ORDER_COMPLETE(id), body),

    createRecipe: (body: CreateRecipeApiBody) =>
        http.post<unknown>(ENDPOINT_CLIENT.PRODUCTION_RECIPES, body),

    updateRecipe: (id: string, body: UpdateRecipeApiBody) =>
        http.patch<unknown>(ENDPOINT_CLIENT.PRODUCTION_RECIPE_DETAIL(id), body),

    deleteRecipe: (id: string) => http.delete(ENDPOINT_CLIENT.PRODUCTION_RECIPE_DETAIL(id)),

    /** Parse sau khi có res.data từ getOrders */
    parseOrdersPage: parsePaginatedProduction,
    parseRecipesPage: parsePaginatedRecipes,
    parseRecipeDetailPayload: (raw: unknown): RecipeDetail => {
        const root = (raw ?? {}) as Record<string, unknown>;
        const inner = (root.recipe ?? root.data ?? root) as Record<string, unknown>;
        return normalizeRecipeDetail(inner);
    },

    parseOrderDetailPayload: (raw: unknown): ProductionOrderDetail => parseProductionOrderDetailPayload(raw),
};
