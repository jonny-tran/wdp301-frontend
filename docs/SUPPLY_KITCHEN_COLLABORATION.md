# Tương tác Supply — Bếp (`waiting_for_production`)

## Luồng

1. **SC** — PATCH `/orders/coordinator/:id/request-production` `{ note? }` → đơn → `waiting_for_production`.
2. **Bếp** — PATCH `/orders/kitchen/:id/production-response` `{ action: 'accept' | 'reject', note }`  
   - `accept`: đơn về `pending`, cờ `is_production_confirmed` (hoặc tương đương BE), có thể tạo production order.  
   - `reject`: đơn về `pending`, ghi `note` lý do.

3. **Danh sách chờ bếp** — GET `/orders?status=waiting_for_production`.

## Frontend

- **Allocation:** nút “Yêu cầu Bếp sản xuất thêm” khi thiếu ATP / `PARTIAL_STOCK` (theo approval-suggestion).
- **Kitchen /production:** tab “Yêu cầu từ Điều phối” + KPI placeholder (acceptance rate cần API analytics sau).

Đối chiếu Swagger nếu path/body lệch tài liệu này.
