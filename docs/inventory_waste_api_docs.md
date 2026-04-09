# Tài liệu 3 API Waste - Module Inventory

Dưới đây là chi tiết về 3 API chuyên trách việc xử lý và báo cáo hao hụt (Waste) trong hệ thống quản lý inventory.

---

## 1. API Tiêu hủy lô hàng (Report Waste)
Dùng để ghi nhận việc tiêu hủy **toàn bộ (100%)** một lô hàng hiện có trong kho (do hết hạn hoặc hư hỏng).

- **Endpoint:** `POST /inventory/waste`
- **Method:** `POST`
- **Roles:** `ADMIN`, `MANAGER`, `CENTRAL_KITCHEN_STAFF`

### Tham số yêu cầu (Body)
| Trường | Kiểu | Bắt buộc | Mô tả |
| :--- | :--- | :---: | :--- |
| `batchId` | `number` | Có | ID của lô hàng cần tiêu hủy. |
| `reason` | `string` | Có | Lý do: `EXPIRED` (Hết hạn) hoặc `DAMAGED` (Hỏng). |
| `note` | `string` | Không | Ghi chú thêm chi tiết. |

### Kết quả trả về (Success 200/201)
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "referenceId": "WST-1234567890", // Mã tham chiếu giao dịch
    "batchId": 1,
    "batchCode": "BATCH-001",
    "productId": 2,
    "wastedQuantity": 50, // Số lượng đã tiêu hủy
    "lossAmount": 500000, // Giá trị thiệt hại (Qty * UnitCost)
    "reason": "EXPIRED",
    "note": "Hàng hết hạn từ tuần trước",
    "newBatchStatus": "empty" // Trạng thái mới của lô
  }
}
```

---

## 2. API Báo cáo tổng quan hao hụt (Waste Summary Report)
Cung cấp các chỉ số KPI về hao hụt tài chính và tỷ lệ phần trăm thiệt hại so với hàng nhập.

- **Endpoint:** `GET /inventory/analytics/waste`
- **Method:** `GET`
- **Roles:** `ADMIN`, `MANAGER`, `KITCHEN_STAFF`, `LOGISTICS`

### Tham số yêu cầu (Query Params)
| Tham số | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `fromDate` | `string` | Ngày bắt đầu (YYYY-MM-DD). |
| `toDate` | `string` | Ngày kết thúc (YYYY-MM-DD). |
| `warehouseId` | `number` | (Tùy chọn) ID kho cụ thể. Nếu trống sẽ tính tổng các kho. |

### Kết quả trả về (Success 200)
```json
{
  "kpi": {
    "totalLossAmount": 12000000, // Tổng thiệt hại bằng tiền
    "importRevenueInPeriod": 400000000, // Tổng giá trị nhập hàng trong kỳ
    "wastePercentage": 3.0, // Tỷ lệ hao hụt (%)
    "period": "2026-01-01 đến 2026-12-31"
  },
  "topCostlyProducts": [
    {
      "productId": 10,
      "productName": "Thịt gà tươi",
      "totalWasteQuantity": 100,
      "totalLossAmount": 5000000
    }
  ],
  "details": [...] // Danh sách gom nhóm theo sản phẩm
}
```

---

## 3. API Nhật ký tiêu hủy chi tiết (Detailed Waste Report)
Liệt kê chi tiết từng giao dịch tiêu hủy (audit log) để kiểm tra lịch sử cụ thể.

- **Endpoint:** `GET /inventory/analytics/waste-report`
- **Method:** `GET`
- **Roles:** `ADMIN`, `MANAGER`, `KITCHEN_STAFF`, `LOGISTICS`

### Tham số yêu cầu (Query Params)
| Tham số | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `startDate` | `string` | Ngày bắt đầu (YYYY-MM-DD). |
| `endDate` | `string` | Ngày kết thúc (YYYY-MM-DD). |
| `warehouseId` | `number` | (Tùy chọn) ID kho cụ thể. |

### Kết quả trả về (Success 200)
```json
{
  "kpi": {
    "totalWasteQuantity": 250,
    "totalLossAmount": 15000000
  },
  "data": [
    {
      "transactionId": 500,
      "batchCode": "BATCH-ABC-01",
      "productName": "Sữa tươi",
      "wastedQuantity": 10,
      "lossAmount": 300000,
      "wasteReason": "DAMAGED",
      "reasonNote": "Bị vỡ khi vận chuyển",
      "createdAt": "2026-04-07T10:00:00Z"
    }
  ]
}
```
