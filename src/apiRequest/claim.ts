import http from "@/lib/http";
import { CreateClaimBodyType, ResolveClaimBodyType } from "@/schemas/claim";
import { BaseResponePagination } from "@/types/base";
import { Claim, QueryClaim } from "@/types/claim";
import { ENDPOINT_CLIENT } from "@/utils/endponit";

export const claimRequest = {

    // GET /claims
    getClaims: (query: QueryClaim) => http.get<BaseResponePagination<Claim[]>>(ENDPOINT_CLIENT.CLAIMS, { query }),

    // GET /claims/:id
    getClaimDetail: (id: string) => http.get<Claim>(ENDPOINT_CLIENT.CLAIM_DETAIL(id)),

    // GET /claims/my-store
    getMyStoreClaims: (query: QueryClaim) => http.get<BaseResponePagination<Claim[]>>(ENDPOINT_CLIENT.CLAIM_MY_STORE, { query }),

    // POST /claims
    createClaim: (data: CreateClaimBodyType) => http.post<Claim>(ENDPOINT_CLIENT.CREATE_CLAIM, data),

    // PATCH /claims/:id/resolve
    resolveClaim: (id: string, data: ResolveClaimBodyType) => http.patch<Claim>(ENDPOINT_CLIENT.RESOLVE_CLAIM(id), data),
};
