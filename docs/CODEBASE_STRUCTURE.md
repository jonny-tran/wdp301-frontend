# Cấu trúc & quy ước code — wdp301-frontend

Tài liệu này mô tả cách dự án tổ chức code để khi phát triển tính năng mới (gọi API, thêm màn hình, phân quyền) có thể làm đúng pattern mà không cần đọc lại toàn bộ codebase.

---

## 1. Stack chính

| Thành phần | Thư viện / ghi chú |
|------------|-------------------|
| Framework | Next.js 16 (App Router) |
| Server/Client | `page.tsx` có thể là Server Component; dữ liệu tương tác dùng component `"use client"` |
| Gọi API & cache | `@tanstack/react-query` (hooks bọc `useQuery` / `useMutation`) |
| HTTP | `fetch` qua wrapper `src/lib/http.ts` (Bearer token, refresh token, parse lỗi) |
| Form / validation | `react-hook-form` + Zod (`src/schemas/`) |
| Session client | Zustand `src/stores/sesionStore.ts` |
| Toast | `sonner` |
| UI | Radix + Tailwind, component dùng chung trong `src/components/ui/` |

---

## 2. Sơ đồ luồng dữ liệu (chuẩn nên làm)

```
ENDPOINT_CLIENT / ENDPOINT_SERVER (utils/endponit.ts)
        ↓
apiRequest/<domain>.ts  →  gọi http.get/post/patch/... với URL + body/query typed
        ↓
hooks/use<Domain>.ts    →  useQuery / useMutation, queryKey từ QUERY_KEY, invalidate KEY.*
        ↓
app/.../page.tsx        →  (tuỳ chọn) metadata, Suspense, parse searchParams
        ↓
app/.../_components/*Client.tsx  →  dùng hooks, UI, gọi mutation, xử lý lỗi
```

**Nguyên tắc:**

- **Không** gọi `http` trực tiếp từ component nếu đã có `apiRequest` + hook tương ứng — gom vào hook để tái sử dụng và đồng bộ cache.
- Response backend thống nhất kiểu `ResponseData<T>` (`src/types/base.ts`): lấy dữ liệu qua `res.data` sau khi `http` trả về.

---

## 3. Cấu trúc thư mục `src` (vai trò từng phần)

| Đường dẫn | Vai trò |
|-----------|---------|
| `app/` | App Router: route, `layout.tsx`, `page.tsx`, thường kèm `_components/` cho UI theo route |
| `apiRequest/` | Một file ~ một miền nghiệp vụ (`order.ts`, `auth.ts`, …): object chứa các hàm gọi API |
| `hooks/` | `useOrder`, `useAuth`, …: bọc React Query + toast + `invalidateQueries` |
| `types/` | TypeScript types cho entity & query param (response/request shape từ backend) |
| `schemas/` | Schema Zod + `z.infer` export type cho **body** form / payload mutation |
| `lib/http.ts` | Client HTTP duy nhất: token, refresh, query string, lỗi |
| `lib/errors.ts` | `HttpError`, `EntityError`, `handleErrorApi` (map lỗi server → RHF `setError`) |
| `lib/authz.ts` | `P.*` permission constants, `checkPermission(user, resource, permission)` |
| `utils/constant.ts` | `KEY`, `QUERY_KEY` cho React Query; `Action`, `Resource` |
| `utils/endponit.ts` | Hằng số path API: `ENDPOINT_CLIENT` (backend), `ENDPOINT_SERVER` (Next route nội bộ auth cookie) |
| `utils/enum.ts` | `Role`, `HttpErrorCode`, status enum, … |
| `stores/sesionStore.ts` | `accessToken`, `refreshToken`, `user` (decode từ JWT) |
| `context/authContext.tsx` | `AuthProvider`: hydrate token từ cookie, refresh khi thiếu access token |
| `components/` | Layout (`BaseLayout`, `DashboardLayout`), UI chia sẻ, `shared/` |
| `config.ts` | Validate biến môi trường (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_URL`) |
| `config/navigation.ts` | `ROLE_NAVIGATION`: menu theo role + `requiredPermission` |
| `proxy.ts` | Logic tương đương middleware: public path, cookie, RBAC theo prefix route |

---

## 4. Types (`src/types/`) vs Schemas (`src/schemas/`)

- **`types/`**: mô tả **dữ liệu** (entity, pagination, query filter). Ví dụ `types/order.ts`, `types/base.ts` (`ResponseData<T>`, `BaseResponsePagination<T>`, `PaginationMeta`).
- **`schemas/`**: **Zod** cho input gửi đi (form / mutation). Export `SomethingBodyType = z.infer<typeof SomethingBody>`.

**Quy ước:** `apiRequest` dùng type từ `types/` cho generic `http.get<T>` và type từ `schemas/` cho body POST/PATCH khi có validation phía client.

---

## 5. Endpoint & hai nhóm URL

- **`ENDPOINT_CLIENT`** (`utils/endponit.ts`): path gọi **API backend** (prefix bởi `NEXT_PUBLIC_API_URL` trong `http`).
- **`ENDPOINT_SERVER`**: path **Route Handler Next** (`/api/login`, `/api/refresh_token`, …) dùng khi cần set/clear cookie qua server — xem `authRequest.loginServer`, `logoutServer`, `refreshTokenServer` với `baseURL: ""`.

Auth gọi backend có `skipAuth: true` (ví dụ refresh) để không gắn Bearer.

---

## 6. Lớp `lib/http.ts`

- Dùng `fetch`, gắn `Authorization: Bearer` nếu có token (từ cookie phía server hoặc Zustand phía client).
- **401** + message token hết hạn → refresh token (chỉ client), retry một lần.
- Lỗi HTTP → ném `HttpError` hoặc `EntityError` (422 / validation array).
- Component/form xử lý lỗi qua `handleErrorApi({ error, setError })` từ `lib/errors.ts`.

---

## 7. React Query: `KEY` và `QUERY_KEY`

Định nghĩa tập trung trong `src/utils/constant.ts`:

- **`KEY`**: mảng ngắn để **invalidate** theo nhóm (ví dụ `KEY.orders` = `['orders']`).
- **`QUERY_KEY`**: hàm tạo **queryKey đầy đủ** có tham số (ví dụ `QUERY_KEY.orders.list(query)`).

Khi thêm API list/detail mới:

1. Thêm key vào `KEY` / `QUERY_KEY` nếu cần.
2. Trong hook, `useQuery({ queryKey: QUERY_KEY...., queryFn: () => (await xRequest...).data })`.
3. Trong `useMutation.onSuccess`, `queryClient.invalidateQueries({ queryKey: KEY.<entity> })` hoặc key chi tiết hơn.

Mặc định `QueryClientProviderWrapper` đặt `staleTime` ~ 5 phút, `retry: false`, `refetchOnWindowFocus: false`.

---

## 8. Pattern hooks (`src/hooks/use*.ts`)

- File **`'use client'`**.
- Export một hook factory hoặc object chứa nhiều hàm trả về `useQuery` / `useMutation` (ví dụ `useOrder()` có `orderList`, `createOrder`, …).
- Import `orderRequest` từ `apiRequest`, không duplicate URL.
- Mutation: `toast.success` trong `onSuccess`, `invalidateQueries` phù hợp, có thể `handleErrorApi` trong component khi `mutate` thất bại.

**Lưu ý:** `useAuth.ts` có eslint-disable cho rules-of-hooks vì pattern đặc biệt — khi thêm hook mới nên giữ pattern `useQuery` ở top-level trong custom hook con hoặc tách rõ để tránh vi phạm rules-of-hooks.

---

## 9. Phân quyền (RBAC)

- **`lib/authz.ts`**: constants `P.ORDER_READ_CATALOG`, … — **không** hardcode string permission trong UI; luôn dùng `P.*`.
- **`checkPermission(user, resource, permission)`**: `resource` từ `Resource` (`utils/constant.ts`), `permission` từ `P`.
- **`usePermission()`**: `can(resource, permission)` dựa trên `user` trong Zustand.
- **Menu**: `config/navigation.ts` — `ROLE_NAVIGATION[role]` + `requiredPermission` lọc trong `BaseLayout`.
- **Theo route**: `src/proxy.ts` khớp prefix (`/admin`, `/manager`, `/kitchen`, `/store`, `/supply`) với `Role` được phép.

---

## 10. App Router & component theo feature

- **`page.tsx`**: có thể `async`, export `metadata`, đọc `searchParams` (Next 15+ dạng Promise), bọc `Suspense`.
- Logic client + React Query đặt trong **`_components/*Client.tsx`** (ví dụ `InventoryClient.tsx`).
- Component chỉ dùng một màn: để cạnh route trong `_components/`.
- Mapper tùy chọn: ví dụ `order.mapper.ts`, `claims.mapper.ts` khi cần biến đổi DTO → view model.

Layout theo khu vực (`manager/layout.tsx`, …) bọc `BaseLayout` + title portal.

---

## 11. Auth end-to-end (rút gọn)

1. Đăng nhập: `authRequest.loginClient` → `loginServer` set cookie.
2. `RootLayout` đọc cookie, `AuthProvider` hydrate `useSessionStore`.
3. Request API: `http` lấy token; hết hạn → refresh → đồng bộ cookie qua `refreshTokenServer`.
4. `proxy.ts` chặn route private khi không có refresh token / sai role.

---

## 12. Checklist thêm tính năng mới (API + UI)

1. Thêm/ cập nhật path trong **`utils/endponit.ts`** (`ENDPOINT_CLIENT`).
2. Thêm type response/query vào **`types/`** nếu backend có kiểu mới.
3. Thêm Zod schema **`schemas/`** nếu có body mới.
4. Thêm hàm vào **`apiRequest/<domain>.ts`** dùng `http` + `ENDPOINT_CLIENT`.
5. Mở rộng **`KEY` / `QUERY_KEY`** trong `utils/constant.ts`.
6. Mở rộng **`hooks/use<Domain>.ts`** (query/mutation).
7. Trang trong **`app/.../page.tsx`** + component trong **`_components/`**.
8. Nếu cần ẩn/hiện theo quyền: thêm **`P.*`** + entry trong **`PERMISSION`** trong `authz.ts`, cập nhật menu hoặc `can()` trong UI.
9. Lỗi form: truyền `setError` vào `handleErrorApi` khi bắt `EntityError`.

---

## 13. File & tên đáng nhớ

- Biến môi trường bắt buộc: xem `src/config.ts` (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_URL`).
- Tên file endpoint: `endponit.ts` (typo lịch sử) — import nhất quán theo codebase hiện tại.
- Store session: `sesionStore.ts` (typo lịch sử).

---

*Tài liệu phản ánh cấu trúc tại thời điểm tạo; khi refactor lớn (ví dụ đổi tên file typo), nên cập nhật mục 13 cho khớp.*
