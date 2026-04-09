# Chi tiết các API Waste (Tiêu hủy & Hao hụt) - Module Inventory

Hệ thống cung cấp bộ 3 API chuyên biệt để quản lý việc tiêu hủy hàng hóa (Waste Management), từ việc ghi nhận nghiệp vụ tại kho đến việc báo cáo phân tích thiệt hại tài chính.

---

## 1. API Ghi nhận Tiêu hủy (Report Waste)
**Endpoint:** `POST /inventory/waste`  
**Chức năng:** Cho phép Kitchen Staff hoặc Manager ghi nhận việc tiêu hủy **100% số lượng còn lại** của một lô hàng (Batch) cụ thể trong kho.

### Đặc điểm kỹ thuật:
- **Nguyên tử (Atomic):** Sử dụng Transaction và `pg_advisory_xact_lock` để đảm bảo không có xung đột dữ liệu khi nhiều người cùng thao tác trên một kho.
- **Tự động hóa:** Hệ thống tự động tính toán giá trị thiệt hại (`lossAmount`) dựa trên đơn giá tại thời điểm nhập khẩu (`unit_cost_at_import`) lưu trong Batch.
- **Cập nhật trạng thái:** Sau khi tiêu hủy, số lượng tồn kho của lô đó sẽ về **0**, và trạng thái lô hàng được cập nhật thành `damaged` (nếu lý do là hỏng) hoặc `empty`.

### Tham số yêu cầu (Body):
| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `batchId` | Number | ID của lô hàng cần tiêu hủy. |
| `reason` | String | `EXPIRED` (Hết hạn) hoặc `DAMAGED` (Hỏng hóc). |
| `note` | String | (Tùy chọn) Ghi chú chi tiết lý do tiêu hủy. |

---

## 2. API Tổng quan Phân tích Hao hụt (Waste Analytics Summary)
**Endpoint:** `GET /inventory/analytics/waste`  
**Chức năng:** Cung cấp các chỉ số KPI quan trọng về tình hình hao hụt của kho trong một khoảng thời gian.

### Các chỉ số chính (KPIs):
- **Total Loss Amount:** Tổng giá trị thiệt hại tài chính (VND) do tiêu hủy.
- **Waste Percentage:** Tỷ lệ % hao hụt so với tổng giá trị hàng nhập trong cùng kỳ. Đây là chỉ số quan trọng để đánh giá hiệu quả quản lý kho.
- **Top Costly Products:** Danh sách 5 sản phẩm gây thiệt hại tài chính lớn nhất.

### Tham số truy vấn (Query):
- `fromDate`, `toDate`: Khoảng thời gian lọc.
- `warehouseId`: (Tùy chọn) Lọc theo kho cụ thể. Nếu để trống, hệ thống sẽ tổng hợp từ tất cả các kho.

---

## 3. API Báo cáo Chi tiết Tiêu hủy (Detailed Waste Report)
**Endpoint:** `GET /inventory/analytics/waste-report`  
**Chức năng:** Trả về danh sách chi tiết các giao dịch tiêu hủy đã thực hiện, phục vụ việc đối soát và kiểm tra kỹ thuật (Drill-down).

### Thông tin trả về:
- **Thông tin sản phẩm:** SKU, Tên sản phẩm, Đơn vị tính.
- **Thông tin giao dịch:** Mã lô (`batchCode`), Số lượng hủy, Giá trị thiệt hại từng dòng, Lý do cụ thể.
- **Thời gian:** Thời điểm chính xác thực hiện việc hủy.

### Ý nghĩa nghiệp vụ:
API này được thiết kế theo chuẩn Query Builder thực thi `groupBy` và `orderBy` để Manager có thể nhanh chóng xác định các "điểm đen" trong chuỗi cung ứng (ví dụ: một sản phẩm cụ thể thường xuyên bị hỏng hoặc hết hạn).

---

> [!IMPORTANT]
> **Lưu ý về Tài chính:**  
> Tất cả giá trị thiệt hại (`lossAmount`) trong các báo cáo này được tính dựa trên giá vốn thực tế tại thời điểm nhập hàng (Snapshot), đảm bảo tính giá gốc cho kế toán ngay cả khi giá thị trường biến động.
