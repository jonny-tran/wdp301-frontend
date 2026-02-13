# API DOCUMENTATION - WDP301 WAREHOUSE & DISTRIBUTION MANAGEMENT SYSTEM

## 📋 Mục lục
- [Data Types & Validation Rules](#data-types--validation-rules)
- [Authentication APIs](#authentication-apis)
- [Order Management APIs](#order-management-apis)
- [Claim Management APIs](#claim-management-apis)
- [Franchise Store Management APIs](#franchise-store-management-apis)
- [Inventory Management APIs](#inventory-management-apis)
- [Product & Batch Management APIs](#product--batch-management-apis)
- [Shipment Management APIs](#shipment-management-apis)
- [Warehouse Operations APIs](#warehouse-operations-apis)
- [Inbound Logistics APIs](#inbound-logistics-apis)
- [Supplier Management APIs](#supplier-management-apis)
- [Common Response Format](#common-response-format)
- [Error Handling](#error-handling)
- [Notes & References](#notes--references)

---

## 📐 Data Types & Validation Rules

### Common Data Types
- **string**: Chuỗi ký tự
- **number**: Số (integer hoặc float)
- **integer**: Số nguyên
- **boolean**: true/false
- **uuid**: UUID version 4 format
- **email**: Email format (example@domain.com)
- **url**: URL format (https://example.com)
- **date**: ISO 8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
- **enum**: Giá trị trong tập hợp cố định

### Validation Decorators
- **@IsNotEmpty()**: Không được để trống (required)
- **@IsOptional()**: Trường không bắt buộc (optional)
- **@IsString()**: Phải là chuỗi
- **@IsInt()**: Phải là số nguyên
- **@IsNumber()**: Phải là số
- **@IsPositive()**: Phải là số dương
- **@Min(n)**: Giá trị tối thiểu là n
- **@Max(n)**: Giá trị tối đa là n
- **@MinLength(n)**: Độ dài tối thiểu n ký tự
- **@MaxLength(n)**: Độ dài tối đa n ký tự
- **@IsEmail()**: Phải là email hợp lệ
- **@IsUrl()**: Phải là URL hợp lệ
- **@IsUUID()**: Phải là UUID hợp lệ
- **@IsEnum(enum)**: Phải là giá trị trong enum
- **@IsArray()**: Phải là mảng
- **@IsDateString()**: Phải là date string hợp lệ

### Field Notation
- ✅ **Required**: Field bắt buộc, không được null/undefined
- ⚪ **Optional**: Field không bắt buộc, có thể bỏ qua
- 🔢 **Type**: Kiểu dữ liệu
- 📏 **Validation**: Quy tắc validate
- 💡 **Example**: Ví dụ giá trị

### Common Query Parameters (for GET endpoints)

#### Pagination Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | ⚪ | 1 | Số trang (≥ 1) |
| limit | integer | ⚪ | 10 hoặc 20 | Số items per page |
| offset | integer | ⚪ | 0 | Số items bỏ qua (alternative to page) |

#### Filter Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | ⚪ | Tìm kiếm theo tên, SKU, etc. |
| searchTerm | string | ⚪ | Từ khóa tìm kiếm |
| status | enum | ⚪ | Lọc theo trạng thái |
| storeId | uuid | ⚪ | Lọc theo cửa hàng |
| warehouseId | integer | ⚪ | Lọc theo kho |
| productId | integer | ⚪ | Lọc theo sản phẩm |
| supplierId | integer | ⚪ | Lọc theo nhà cung cấp |
| isActive | boolean | ⚪ | Lọc theo trạng thái hoạt động |
| date | string (date) | ⚪ | Lọc theo ngày |
| type | enum | ⚪ | Lọc theo loại |

#### Sort Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sortBy | string | ⚪ | Trường cần sort (createdAt, name, etc.) |
| sortOrder | enum | ⚪ | ASC hoặc DESC |

**Example Query String**:
```
GET /orders?page=1&limit=20&status=pending&storeId=uuid-123&sortBy=createdAt&sortOrder=DESC
```

### Common Response Patterns

#### Success with Data
```json
{
  "statusCode": 200,
  "message": "Success message (optional)",
  "data": { /* actual data */ }
}
```

#### Success with Pagination
```json
{
  "statusCode": 200,
  "message": "Success message (optional)",
  "data": {
    "items": [ /* array of items */ ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Validation Error (422)
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "details": [
    {
      "field": "email",
      "constraints": {
        "isEmail": "Email không đúng định dạng",
        "isNotEmpty": "Email không được để trống"
      }
    },
    {
      "field": "password",
      "constraints": {
        "minLength": "Mật khẩu phải có ít nhất 6 ký tự"
      }
    }
  ]
}
```

### Auto-transform Behaviors
Backend tự động xử lý một số transformations:

1. **Email**: Tự động `.trim()` và `.toLowerCase()`
2. **String fields**: Tự động `.trim()` whitespace
3. **Enum values**: Tự động `.toLowerCase()`
4. **UUID**: Tự động `.trim()`

**Frontend nên trim trước khi gửi để tránh validation errors**

### Enums Reference

#### UserRole Enum
```typescript
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  SUPPLY_COORDINATOR = 'supply_coordinator',
  CENTRAL_KITCHEN_STAFF = 'central_kitchen_staff',
  FRANCHISE_STORE_STAFF = 'franchise_store_staff'
}
```

**Usage**: Trong CreateUserDto, phân quyền API

#### OrderStatus Enum
```typescript
enum OrderStatus {
  PENDING = 'pending',         // Chờ duyệt
  APPROVED = 'approved',       // Đã duyệt
  REJECTED = 'rejected',       // Từ chối
  CANCELLED = 'cancelled',     // Đã hủy
  PICKING = 'picking',         // Đang soạn hàng
  DELIVERING = 'delivering',   // Đang giao hàng
  COMPLETED = 'completed',     // Hoàn thành
  CLAIMED = 'claimed'          // Có khiếu nại
}
```

**Usage**: Filter orders, order status updates

#### ShipmentStatus Enum
```typescript
enum ShipmentStatus {
  PREPARING = 'preparing',     // Đang chuẩn bị
  IN_TRANSIT = 'in_transit',   // Đang vận chuyển
  DELIVERED = 'delivered',     // Đã giao hàng
  COMPLETED = 'completed',     // Hoàn thành
  CANCELLED = 'cancelled'      // Đã hủy
}
```

**Usage**: Filter shipments, shipment tracking

#### ClaimStatus Enum
```typescript
enum ClaimStatus {
  PENDING = 'pending',         // Chờ xử lý
  APPROVED = 'approved',       // Đã chấp nhận
  REJECTED = 'rejected'        // Từ chối
}
```

**Usage**: Filter claims, resolve claims

#### TransactionType Enum
```typescript
enum TransactionType {
  IMPORT = 'import',           // Nhập kho
  EXPORT = 'export',           // Xuất kho
  WASTE = 'waste',             // Hao hụt
  ADJUSTMENT = 'adjustment'    // Điều chỉnh
}
```

**Usage**: Filter inventory transactions

#### ReceiptStatus Enum
```typescript
enum ReceiptStatus {
  DRAFT = 'draft',             // Nháp (đang soạn)
  COMPLETED = 'completed',     // Đã hoàn tất
  CANCELLED = 'cancelled'      // Đã hủy
}
```

**Usage**: Filter inbound receipts

#### BatchStatus Enum
```typescript
enum BatchStatus {
  PENDING = 'pending',         // Chờ xử lý
  AVAILABLE = 'available',     // Sẵn sàng
  EMPTY = 'empty',             // Hết hàng
  EXPIRED = 'expired'          // Hết hạn
}
```

**Usage**: Batch management, inventory tracking

#### WarehouseType Enum
```typescript
enum WarehouseType {
  CENTRAL = 'central',                // Kho trung tâm
  STORE_INTERNAL = 'store_internal'   // Kho cửa hàng
}
```

**Usage**: Warehouse management

#### UserStatus Enum
```typescript
enum UserStatus {
  ACTIVE = 'active',           // Đang hoạt động
  BANNED = 'banned'            // Bị khóa
}
```

**Usage**: User management

---

## 🔐 Authentication APIs

### 1. POST `/auth/login`
**Mô tả**: Đăng nhập hệ thống  
**Quyền truy cập**: Public  
**Rate Limit**: 5 requests/60s

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| email | string | ✅ | @IsEmail, @IsNotEmpty | Email đăng nhập (tự động trim & lowercase) |
| password | string | ✅ | @IsNotEmpty, @MinLength(6) | Mật khẩu (tối thiểu 6 ký tự) |

**Request Body Example**:
```json
{
  "email": "admin@gmail.com",
  "password": "pass123456789"
}
```

**Validation Errors**:
- `Email không đúng định dạng` - Nếu email không hợp lệ
- `Email không được để trống` - Nếu thiếu email
- `Mật khẩu không được để trống` - Nếu thiếu password
- `Mật khẩu phải có ít nhất 6 ký tự` - Nếu password < 6 ký tự

**Response**:
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "userId": "uuid-string",
    "email": "admin@gmail.com",
    "username": "Admin User",
    "role": "admin",
    "storeId": "uuid-string",
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 2. POST `/auth/refresh-token`
**Mô tả**: Làm mới Access Token  
**Quyền truy cập**: Public  
**Rate Limit**: 5 requests/60s

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 3. GET `/auth/me`
**Mô tả**: Lấy thông tin user hiện tại  
**Quyền truy cập**: Authenticated  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "id": "uuid-string",
    "email": "admin@gmail.com",
    "username": "Admin User",
    "role": "admin",
    "storeId": "uuid-string",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. POST `/auth/logout`
**Mô tả**: Đăng xuất (revoke refresh token)  
**Quyền truy cập**: Authenticated  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Logout successful"
}
```

---

### 5. POST `/auth/create-user`
**Mô tả**: Tạo tài khoản mới  
**Quyền truy cập**: ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| username | string | ✅ | @IsString, @IsNotEmpty | Tên hiển thị của nhân viên |
| email | string | ✅ | @IsEmail, @IsNotEmpty | Email đăng nhập (unique, auto trim & lowercase) |
| password | string | ✅ | @IsString, @MinLength(6) | Mật khẩu (tối thiểu 6 ký tự) |
| role | enum | ✅ | @IsEnum(UserRole) | Vai trò: admin, manager, supply_coordinator, central_kitchen_staff, franchise_store_staff |
| storeId | uuid | ⚪ | @IsUUID(4), @IsOptional | ID cửa hàng (Bắt buộc nếu role = franchise_store_staff) |

**Request Body Example**:
```json
{
  "username": "Nguyen Van A",
  "email": "manager.q1@gmail.com",
  "password": "123456",
  "role": "franchise_store_staff",
  "storeId": "uuid-store-id-here"
}
```

**Validation Errors**:
- `Tên hiển thị phải là chuỗi ký tự` / `Tên hiển thị không được để trống`
- `Email không đúng định dạng` / `Email không được để trống`
- `Mật khẩu phải có ít nhất 6 ký tự`
- `Vai trò không hợp lệ` - Role phải thuộc enum
- `Store ID phải là UUID v4` - Nếu storeId không đúng format

**Response**:
```json
{
  "statusCode": 201,
  "message": "Tạo tài khoản mới thành công",
  "data": {
    "id": "uuid-string",
    "email": "manager.q1@gmail.com",
    "username": "Nguyen Van A",
    "role": "franchise_store_staff",
    "storeId": "uuid-store-id-here"
  }
}
```

---

### 6. POST `/auth/forgot-password`
**Mô tả**: Gửi OTP qua email để đặt lại mật khẩu  
**Quyền truy cập**: Public  
**Rate Limit**: 5 requests/60s

**Request Body**:
```json
{
  "email": "admin@gmail.com"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Gửi mã xác thực thành công"
}
```

---

### 7. POST `/auth/reset-password`
**Mô tả**: Đặt lại mật khẩu bằng OTP  
**Quyền truy cập**: Public  
**Rate Limit**: 1 request/60s

**Request Body**:
```json
{
  "email": "admin@gmail.com",
  "code": "123456",
  "password": "NewPass@123"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Đặt lại mật khẩu thành công"
}
```

---

### 8. GET `/auth/roles`
**Mô tả**: Lấy danh sách vai trò trong hệ thống  
**Quyền truy cập**: ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách vai trò thành công",
  "data": [
    {
      "value": "admin",
      "label": "Quản trị viên"
    },
    {
      "value": "manager",
      "label": "Người quản lý"
    },
    {
      "value": "supply_coordinator",
      "label": "Điều phối viên cung ứng"
    },
    {
      "value": "central_kitchen_staff",
      "label": "Nhân viên bếp trung tâm"
    },
    {
      "value": "franchise_store_staff",
      "label": "Nhân viên cửa hàng"
    }
  ]
}
```

---

## 📦 Order Management APIs

### 1. GET `/orders/catalog?isActive=true`
**Mô tả**: Lấy danh sách sản phẩm hiện có trong catalog để tạo đơn hàng  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `isActive` (optional): Filter sản phẩm đang hoạt động

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "productId": 1,
      "sku": "PROD-001",
      "name": "Gà rán KFC Original",
      "unit": "Kg",
      "imageUrl": "https://cdn.com/image.jpg",
      "isAvailable": true
    }
  ]
}
```

---

### 2. POST `/orders`
**Mô tả**: Tạo đơn hàng mới  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| deliveryDate | string (ISO date) | ✅ | @IsDateString, @IsNotEmpty, @IsFutureDate | Ngày giao hàng (phải >= ngày mai, và trước 22:00 nếu đặt cho ngày mai) |
| items | array | ✅ | @IsArray, @ValidateNested | Danh sách sản phẩm đặt hàng |
| items[].productId | integer | ✅ | @IsInt, @IsPositive | ID sản phẩm (phải > 0) |
| items[].quantity | integer | ✅ | @IsInt, @IsPositive | Số lượng đặt (phải > 0) |

**Request Body Example**:
```json
{
  "deliveryDate": "2023-12-25T00:00:00.000Z",
  "items": [
    {
      "productId": 1,
      "quantity": 10
    },
    {
      "productId": 2,
      "quantity": 5
    }
  ]
}
```

**Business Rules**:
- Ngày giao hàng phải là ít nhất 1 ngày trong tương lai
- Nếu đặt hàng sau 22:00, không thể chọn ngày mai làm ngày giao
- Mỗi đơn phải có ít nhất 1 sản phẩm

**Validation Errors**:
- `Ngày giao hàng không hợp lệ` - Format không đúng
- `Đơn hàng đặt sau 22:00 không thể giao vào ngày mai`
- `Ngày giao hàng phải là ít nhất 1 ngày trong tương lai`
- `ID sản phẩm phải là số nguyên` / `ID sản phẩm phải là số dương`
- `Số lượng phải là số nguyên` / `Số lượng phải là số dương`

**Response**:
```json
{
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "orderId": "uuid-string",
    "storeId": "uuid-string",
    "deliveryDate": "2023-12-25T00:00:00.000Z",
    "status": "pending",
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "quantity": 10,
        "unit": "Kg"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 3. GET `/orders/my-store?status=pending`
**Mô tả**: Lấy danh sách đơn hàng của cửa hàng mình  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, approved, rejected, cancelled
- `page` (optional): Số trang
- `limit` (optional): Số lượng items per page

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "orderId": "uuid-string",
      "deliveryDate": "2023-12-25",
      "status": "pending",
      "totalItems": 15,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. GET `/orders?storeId=uuid&status=pending&page=1&limit=20`
**Mô tả**: Lấy danh sách tất cả đơn hàng (Phân trang & Lọc)  
**Quyền truy cập**: MANAGER, SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `storeId` (optional): Filter theo cửa hàng
- `status` (optional): pending, approved, rejected, cancelled
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "orderId": "uuid-string",
        "storeName": "KFC Nguyen Thai Hoc",
        "deliveryDate": "2023-12-25",
        "status": "pending",
        "totalItems": 15,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

### 5. GET `/orders/coordinator/:id/review`
**Mô tả**: Xem chi tiết đơn hàng và so sánh với tồn kho để duyệt đơn  
**Quyền truy cập**: SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "orderId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "deliveryDate": "2023-12-25",
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "requestedQty": 10,
        "availableQty": 8,
        "fulfillmentRate": 80
      }
    ],
    "overallFulfillmentRate": 85
  }
}
```

---

### 6. PATCH `/orders/coordinator/:id/approve`
**Mô tả**: Duyệt đơn hàng  
**Quyền truy cập**: SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "force_approve": true
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Order approved successfully",
  "data": {
    "orderId": "uuid-string",
    "status": "approved"
  }
}
```

---

### 7. PATCH `/orders/coordinator/:id/reject`
**Mô tả**: Từ chối đơn hàng  
**Quyền truy cập**: SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "reason": "Out of stock on key ingredients"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Order rejected successfully",
  "data": {
    "orderId": "uuid-string",
    "status": "rejected",
    "rejectionReason": "Out of stock on key ingredients"
  }
}
```

---

### 8. PATCH `/orders/franchise/:id/cancel`
**Mô tả**: Hủy đơn hàng (Chỉ franchise staff có thể hủy đơn của mình)  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Order cancelled successfully",
  "data": {
    "orderId": "uuid-string",
    "status": "cancelled"
  }
}
```

---

### 9. GET `/orders/:id`
**Mô tả**: Lấy thông tin chi tiết đơn hàng  
**Quyền truy cập**: SUPPLY_COORDINATOR, FRANCHISE_STORE_STAFF, MANAGER, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "orderId": "uuid-string",
    "storeId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "deliveryDate": "2023-12-25",
    "status": "approved",
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "quantity": 10,
        "unit": "Kg"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "approvedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## 🚨 Claim Management APIs

### 1. GET `/claims?status=pending&page=1&limit=20`
**Mô tả**: Lấy danh sách khiếu nại (Phân trang & Lọc)  
**Quyền truy cập**: SUPPLY_COORDINATOR, MANAGER, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, approved, rejected
- `storeId` (optional): Filter theo store
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "claimId": "uuid-string",
        "shipmentId": "uuid-string",
        "status": "pending",
        "totalDamaged": 5,
        "totalMissing": 2,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

---

### 2. GET `/claims/my-store?status=pending`
**Mô tả**: Lấy danh sách khiếu nại của cửa hàng mình  
**Quyền truy cập**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, approved, rejected

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "claimId": "uuid-string",
      "shipmentId": "uuid-string",
      "status": "pending",
      "totalDamaged": 5,
      "totalMissing": 2,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. GET `/claims/:id`
**Mô tả**: Lấy chi tiết khiếu nại  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, SUPPLY_COORDINATOR, CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "claimId": "uuid-string",
    "shipmentId": "uuid-string",
    "storeId": "uuid-string",
    "status": "pending",
    "description": "Một số sản phẩm bị hư hỏng",
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "batchId": 1,
        "batchCode": "GA-2024-001",
        "quantityMissing": 2,
        "quantityDamaged": 3,
        "reason": "Packaging damaged during transit",
        "imageProofUrl": "https://cdn.com/proof.jpg"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. POST `/claims`
**Mô tả**: Tạo khiếu nại thủ công  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| shipmentId | uuid | ✅ | @IsUUID, @IsNotEmpty | ID lô hàng |
| description | string | ⚪ | @IsString, @IsOptional | Mô tả chi tiết vấn đề |
| items | array | ✅ | @IsArray, @ValidateNested | Danh sách sản phẩm khiếu nại |
| items[].productId | number | ✅ | @IsNumber, @IsNotEmpty | ID sản phẩm |
| items[].batchId | number | ✅ | @IsNumber, @IsNotEmpty | ID lô hàng |
| items[].quantityMissing | number | ✅ | @IsNumber, @Min(0) | Số lượng thiếu (≥ 0) |
| items[].quantityDamaged | number | ✅ | @IsNumber, @Min(0) | Số lượng hỏng (≥ 0) |
| items[].reason | string | ⚪ | @IsString, @IsOptional | Lý do |
| items[].imageProofUrl | string | ⚪ | @IsString, @IsOptional | Link ảnh bằng chứng |

**Request Body Example**:
```json
{
  "shipmentId": "uuid-string",
  "description": "Một số sản phẩm bị hư hỏng",
  "items": [
    {
      "productId": 1,
      "batchId": 1,
      "quantityMissing": 2,
      "quantityDamaged": 3,
      "reason": "Packaging damaged during transit",
      "imageProofUrl": "https://cdn.com/proof.jpg"
    }
  ]
}
```

**Validation Errors**:
- `Số lượng thiếu không được âm` - quantityMissing < 0
- `Số lượng hàng hỏng không được âm` - quantityDamaged < 0

**Response**:
```json
{
  "statusCode": 201,
  "message": "Tạo khiếu nại thành công. Tồn kho đã được điều chỉnh.",
  "data": {
    "claimId": "uuid-string",
    "shipmentId": "uuid-string",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. PATCH `/claims/:id/resolve`
**Mô tả**: Xử lý/Phản hồi khiếu nại  
**Quyền truy cập**: SUPPLY_COORDINATOR, MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "status": "approved",
  "resolutionNote": "Đã xác nhận và sẽ hoàn trả"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Claim resolved successfully",
  "data": {
    "claimId": "uuid-string",
    "status": "approved",
    "resolutionNote": "Đã xác nhận và sẽ hoàn trả",
    "resolvedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## 🏪 Franchise Store Management APIs

### 1. POST `/stores`
**Mô tả**: Tạo cửa hàng franchise mới  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | ✅ | @IsString, @IsNotEmpty | Tên cửa hàng |
| address | string | ✅ | @IsString, @IsNotEmpty | Địa chỉ cửa hàng |
| phone | string | ⚪ | @IsString, @IsOptional | Số điện thoại liên hệ |
| managerName | string | ⚪ | @IsString, @IsOptional | Tên người quản lý |

**Request Body Example**:
```json
{
  "name": "KFC Nguyen Thai Hoc",
  "address": "123 Nguyen Thai Hoc, Q1, TP.HCM",
  "phone": "0901234567",
  "managerName": "Nguyen Van A"
}
```

**Validation Errors**:
- `Tên cửa hàng không được để trống`
- `Địa chỉ không được để trống`

**Response**:
```json
{
  "statusCode": 201,
  "message": "Store created successfully",
  "data": {
    "id": "uuid-string",
    "name": "KFC Nguyen Thai Hoc",
    "address": "123 Nguyen Thai Hoc, Q1, TP.HCM",
    "phone": "0901234567",
    "managerName": "Nguyen Van A",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. GET `/stores?search=KFC&isActive=true`
**Mô tả**: Lấy danh sách cửa hàng  
**Quyền truy cập**: MANAGER, SUPPLY_COORDINATOR  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): Tìm kiếm theo tên hoặc địa chỉ
- `isActive` (optional): Filter theo trạng thái hoạt động

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "uuid-string",
      "name": "KFC Nguyen Thai Hoc",
      "address": "123 Nguyen Thai Hoc, Q1, TP.HCM",
      "phone": "0901234567",
      "managerName": "Nguyen Van A",
      "isActive": true
    }
  ]
}
```

---

### 3. GET `/stores/:id`
**Mô tả**: Lấy chi tiết cửa hàng  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "id": "uuid-string",
    "name": "KFC Nguyen Thai Hoc",
    "address": "123 Nguyen Thai Hoc, Q1, TP.HCM",
    "phone": "0901234567",
    "managerName": "Nguyen Van A",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 4. PATCH `/stores/:id`
**Mô tả**: Cập nhật thông tin cửa hàng  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "name": "KFC Nguyen Thai Hoc - Branch 2",
  "phone": "0901234568",
  "isActive": true
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Store updated successfully",
  "data": {
    "id": "uuid-string",
    "name": "KFC Nguyen Thai Hoc - Branch 2",
    "phone": "0901234568",
    "isActive": true,
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 5. DELETE `/stores/:id`
**Mô tả**: Xóa cửa hàng  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Store deleted successfully"
}
```

---

## 📊 Inventory Management APIs

### 1. GET `/inventory/store?search=&page=1&limit=20`
**Mô tả**: Xem tồn kho tại cửa hàng của mình  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): Tìm kiếm theo tên sản phẩm
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "inventoryId": 1,
      "batchId": 1,
      "productId": 1,
      "productName": "Gà rán KFC Original",
      "sku": "PROD-001",
      "batchCode": "GA-2024-001",
      "quantity": 50,
      "expiryDate": "2024-01-10T00:00:00.000Z",
      "unit": "Kg",
      "imageUrl": "https://cdn.com/image.jpg"
    }
  ]
}
```

---

### 2. GET `/inventory/store/transactions?type=import&limit=20&offset=0`
**Mô tả**: Xem lịch sử giao dịch kho của cửa hàng  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `type` (optional): import, export, waste, adjustment
- `limit` (optional): Default 20
- `offset` (optional): Default 0

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "transactions": [
      {
        "transactionId": 1,
        "type": "import",
        "productName": "Gà rán KFC Original",
        "batchCode": "GA-2024-001",
        "quantity": 100,
        "date": "2024-01-01T00:00:00.000Z",
        "note": "Nhập hàng từ shipment #123"
      }
    ],
    "total": 50,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 3. GET `/inventory/summary?warehouseId=1&page=1&limit=20&searchTerm=gà`
**Mô tả**: Tổng hợp tồn kho (Dành cho Manager để xem tổng quan)  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `warehouseId` (optional): Filter theo kho
- `searchTerm` (optional): Tìm kiếm sản phẩm
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "sku": "PROD-001",
        "totalQuantity": 500,
        "unit": "Kg",
        "warehouses": [
          {
            "warehouseId": 1,
            "warehouseName": "Kho trung tâm",
            "quantity": 500
          }
        ]
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

### 4. GET `/inventory/low-stock?warehouseId=1`
**Mô tả**: Cảnh báo tồn kho thấp  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `warehouseId` (optional): Filter theo kho

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "productId": 1,
      "productName": "Gà rán KFC Original",
      "sku": "PROD-001",
      "minStockLevel": 100,
      "currentQuantity": 50,
      "unit": "Kg"
    }
  ]
}
```

---

### 5. POST `/inventory/adjust`
**Mô tả**: Điều chỉnh tồn kho (Xử lý hàng hỏng, mất mát, v.v.)  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| warehouseId | number | ✅ | - | ID kho cần điều chỉnh |
| batchId | number | ✅ | - | ID lô hàng |
| adjustmentQuantity | number | ✅ | - | Số lượng điều chỉnh (dương: tăng, âm: giảm) |
| reason | string | ✅ | - | Lý do điều chỉnh (damaged, waste, found, correction, etc.) |
| note | string | ⚪ | - | Ghi chú bổ sung |

**Request Body Example**:
```json
{
  "warehouseId": 1,
  "batchId": 1,
  "adjustmentQuantity": -10,
  "reason": "damaged",
  "note": "Found 10 damaged items during inspection"
}
```

**Common Reasons**:
- `damaged` - Hàng hỏng
- `waste` - Hao hụt
- `found` - Phát hiện thêm hàng
- `correction` - Sửa lỗi đếm kho
- `expired` - Quá hạn sử dụng

**Validation Errors**:
- Tất cả các field bắt buộc (trừ note) đều phải có giá trị

**Response**:
```json
{
  "statusCode": 200,
  "message": "Inventory adjusted successfully",
  "data": {
    "transactionId": 1,
    "warehouseId": 1,
    "batchId": 1,
    "adjustmentQuantity": -10,
    "newQuantity": 40,
    "reason": "damaged"
  }
}
```

---

### 6. GET `/inventory/kitchen/summary?page=1&limit=20&search=gà`
**Mô tả**: Xem tổng tồn kho Bếp trung tâm (Group by Product)  
**Quyền truy cập**: MANAGER, CENTRAL_KITCHEN_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): Tìm kiếm theo tên sản phẩm
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "sku": "PROD-001",
        "totalQuantity": 500,
        "availableQuantity": 450,
        "reservedQuantity": 50,
        "unit": "Kg"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

---

### 7. GET `/inventory/kitchen/details?product_id=1`
**Mô tả**: Xem chi tiết lô hàng của một món (Drill-down)  
**Quyền truy cập**: MANAGER, CENTRAL_KITCHEN_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `product_id` (required): ID của sản phẩm

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "productId": 1,
    "productName": "Gà rán KFC Original",
    "batches": [
      {
        "batchId": 1,
        "batchCode": "GA-2024-001",
        "totalQuantity": 100,
        "availableQuantity": 90,
        "reservedQuantity": 10,
        "expiryDate": "2024-01-10T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 🍗 Product & Batch Management APIs

### 1. POST `/products`
**Mô tả**: Tạo sản phẩm mới  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | ✅ | @IsString, @IsNotEmpty | Tên sản phẩm |
| baseUnitId | integer | ✅ | @IsInt, @Min(1) | ID đơn vị tính (≥ 1) |
| shelfLifeDays | integer | ✅ | @IsInt, @Min(1) | Hạn sử dụng - số ngày (≥ 1) |
| imageUrl | string (url) | ✅ | @IsUrl, @IsNotEmpty | Đường dẫn ảnh sản phẩm (phải là URL hợp lệ) |

**Request Body Example**:
```json
{
  "name": "Gà rán KFC Original",
  "baseUnitId": 1,
  "shelfLifeDays": 3,
  "imageUrl": "https://cdn.com/image.jpg"
}
```

**Validation Errors**:
- `Tên sản phẩm không được để trống`
- `ID đơn vị tính phải là số nguyên dương`
- `Hạn sử dụng phải là số nguyên dương`
- `Đường dẫn ảnh không hợp lệ` - Phải là URL

**Response**:
```json
{
  "statusCode": 201,
  "message": "Tạo sản phẩm thành công",
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "name": "Gà rán KFC Original",
    "baseUnit": "Kg",
    "shelfLifeDays": 3,
    "imageUrl": "https://cdn.com/image.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. GET `/products?page=1&limit=10&search=KFC`
**Mô tả**: Lấy danh sách sản phẩm (Phân trang)  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token  
**Query Parameters**:
- `page` (optional): Default 1
- `limit` (optional): Default 10
- `search` (optional): Tìm kiếm theo tên hoặc SKU

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": {
    "items": [
      {
        "id": 1,
        "sku": "PROD-001",
        "name": "Gà rán KFC Original",
        "baseUnit": "Kg",
        "shelfLifeDays": 3,
        "imageUrl": "https://cdn.com/image.jpg",
        "isActive": true
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

### 3. GET `/products/batches?page=1&limit=10&productId=1`
**Mô tả**: Lấy danh sách lô hàng (Phân trang)  
**Quyền truy cập**: MANAGER, CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `page` (optional): Default 1
- `limit` (optional): Default 10
- `productId` (optional): Filter theo sản phẩm
- `expiryDate` (optional): Filter theo ngày hết hạn

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách lô hàng thành công",
  "data": {
    "items": [
      {
        "id": 1,
        "batchCode": "GA-2024-001",
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "initialQuantity": 100,
        "currentQuantity": 50,
        "expiryDate": "2024-01-10T00:00:00.000Z",
        "imageUrl": "https://cdn.com/batch.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 20,
    "page": 1,
    "limit": 10
  }
}
```

---

### 4. GET `/products/:id`
**Mô tả**: Lấy chi tiết sản phẩm  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy thông tin sản phẩm thành công",
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "name": "Gà rán KFC Original",
    "baseUnit": "Kg",
    "shelfLifeDays": 3,
    "imageUrl": "https://cdn.com/image.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 5. PATCH `/products/:id`
**Mô tả**: Cập nhật thông tin sản phẩm  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "name": "Gà rán KFC Original - Updated",
  "shelfLifeDays": 5
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Cập nhật sản phẩm thành công",
  "data": {
    "id": 1,
    "name": "Gà rán KFC Original - Updated",
    "shelfLifeDays": 5,
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 6. DELETE `/products/:id`
**Mô tả**: Xóa sản phẩm (Soft delete)  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Xóa sản phẩm thành công"
}
```

---

### 7. PATCH `/products/:id/restore`
**Mô tả**: Khôi phục sản phẩm đã xóa  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Khôi phục sản phẩm thành công",
  "data": {
    "id": 1,
    "isActive": true,
    "restoredAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 8. GET `/products/batches/:id`
**Mô tả**: Lấy chi tiết lô hàng  
**Quyền truy cập**: MANAGER, CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy chi tiết lô hàng thành công",
  "data": {
    "id": 1,
    "batchCode": "GA-2024-001",
    "productId": 1,
    "productName": "Gà rán KFC Original",
    "initialQuantity": 100,
    "currentQuantity": 50,
    "expiryDate": "2024-01-10T00:00:00.000Z",
    "imageUrl": "https://cdn.com/batch.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 9. PATCH `/products/batches/:id`
**Mô tả**: Cập nhật thông tin lô hàng  
**Quyền truy cập**: MANAGER, CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "initialQuantity": 120,
  "imageUrl": "https://cdn.com/batch-updated.jpg"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Cập nhật lô hàng thành công",
  "data": {
    "id": 1,
    "initialQuantity": 120,
    "imageUrl": "https://cdn.com/batch-updated.jpg",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## 🚚 Shipment Management APIs

### 1. GET `/shipments?status=in_transit&storeId=uuid&page=1&limit=20`
**Mô tả**: Lấy danh sách lô hàng (Phân trang & Lọc)  
**Quyền truy cập**: MANAGER, SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, in_transit, received, completed
- `storeId` (optional): Filter theo cửa hàng
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách lô hàng thành công",
  "data": {
    "items": [
      {
        "shipmentId": "uuid-string",
        "orderId": "uuid-string",
        "expectedDeliveryDate": "2024-01-05",
        "status": "in_transit",
        "totalItems": 3,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

---

### 2. GET `/shipments/store/my?status=in_transit`
**Mô tả**: Lấy danh sách lô hàng của cửa hàng mình  
**Quyền truy cập**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, in_transit, received, completed

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách lô hàng thành công",
  "data": [
    {
      "shipmentId": "uuid-string",
      "orderId": "uuid-string",
      "expectedDeliveryDate": "2024-01-05",
      "status": "in_transit",
      "totalItems": 3,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. GET `/shipments/:id`
**Mô tả**: Lấy chi tiết lô hàng  
**Quyền truy cập**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy chi tiết lô hàng thành công",
  "data": {
    "shipmentId": "uuid-string",
    "orderId": "uuid-string",
    "storeId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "status": "in_transit",
    "expectedDeliveryDate": "2024-01-05",
    "items": [
      {
        "batchId": 1,
        "batchCode": "GA-2024-001",
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "quantity": 10,
        "unit": "Kg",
        "expiryDate": "2024-01-10"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. GET `/shipments/:id/picking-list`
**Mô tả**: Lấy danh sách nhặt hàng (Picking List) cho lô hàng  
**Quyền truy cập**: SUPPLY_COORDINATOR, CENTRAL_KITCHEN_STAFF, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách nhặt hàng thành công",
  "data": {
    "shipmentId": "uuid-string",
    "orderId": "uuid-string",
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "requiredQty": 10,
        "suggestedBatches": [
          {
            "batchId": 1,
            "batchCode": "GA-2024-001",
            "availableQty": 10,
            "expiryDate": "2024-01-10",
            "location": "A1-B2"
          }
        ]
      }
    ]
  }
}
```

---

### 5. PATCH `/shipments/:id/receive-all`
**Mô tả**: Nhận hàng nhanh (Đủ hàng, không hỏng)  
**Quyền truy cập**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Nhận hàng thành công (Đủ hàng)",
  "data": {
    "shipmentId": "uuid-string",
    "status": "received",
    "receivedAt": "2024-01-05T10:30:00.000Z"
  }
}
```

---

### 6. POST `/shipments/:id/receive`
**Mô tả**: Nhận hàng chi tiết (Báo cáo thiếu/hỏng)  
**Quyền truy cập**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| items | array | ✅ | @IsArray, @ValidateNested | Danh sách lô hàng nhận |
| items[].batchId | integer | ✅ | @IsInt, @IsPositive | ID của batch (lô hàng) |
| items[].actualQty | number | ✅ | @IsNumber, @Min(0) | Số lượng thực tế nhận được (≥ 0) |
| items[].damagedQty | number | ✅ | @IsNumber, @Min(0) | Số lượng hàng hỏng (≥ 0) |
| items[].evidenceUrls | array<string> | ⚪ | @IsArray, @IsString(each), @IsOptional | Danh sách link ảnh bằng chứng |
| notes | string | ⚪ | @IsString, @IsOptional | Ghi chú khi nhận hàng |
| evidenceUrls | array<string> | ⚪ | @IsArray, @IsString(each), @IsOptional | Ảnh bằng chứng chung |

**Request Body Example**:
```json
{
  "items": [
    {
      "batchId": 1,
      "actualQty": 10,
      "damagedQty": 0
    },
    {
      "batchId": 2,
      "actualQty": 8,
      "damagedQty": 2,
      "evidenceUrls": ["https://example.com/damage-proof.jpg"]
    }
  ],
  "notes": "Hàng đã nhận đầy đủ",
  "evidenceUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Business Rules**:
- Nếu có hàng hỏng hoặc thiếu, hệ thống tự động tạo claim
- actualQty + damagedQty <= Số lượng gửi ban đầu
- Nên đính kèm ảnh bằng chứng nếu có vấn đề

**Validation Errors**:
- `Số lượng thực nhận không được âm`
- `Số lượng hàng hỏng không được âm`

**Response**:
```json
{
  "statusCode": 200,
  "message": "Xác nhận nhận hàng thành công",
  "data": {
    "shipmentId": "uuid-string",
    "status": "received",
    "receivedAt": "2024-01-05T10:30:00.000Z",
    "autoCreatedClaim": {
      "claimId": "uuid-string",
      "status": "pending",
      "reason": "Auto-generated due to damaged items"
    }
  }
}
```

---

## 🏭 Warehouse Operations APIs

### 1. GET `/warehouse/picking-tasks?date=2024-01-05&page=1&limit=20`
**Mô tả**: Lấy danh sách tác vụ soạn hàng (Phân trang)  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `date` (optional): Filter theo ngày giao hàng
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách tác vụ soạn hàng thành công",
  "data": {
    "items": [
      {
        "orderId": "uuid-string",
        "storeName": "KFC Nguyen Thai Hoc",
        "deliveryDate": "2024-01-05",
        "totalItems": 3,
        "status": "approved",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 20,
    "page": 1,
    "limit": 20
  }
}
```

---

### 2. GET `/warehouse/picking-tasks/:id`
**Mô tả**: Xem chi tiết danh sách mặt hàng và lô hàng gợi ý cần soạn (FEFO)  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy chi tiết danh sách soạn hàng thành công",
  "data": {
    "orderId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "items": [
      {
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "requiredQty": 10,
        "pickedQty": 0,
        "suggestedBatches": [
          {
            "batchId": 1,
            "batchCode": "GA-2024-001",
            "qtyToPick": 10,
            "expiryDate": "2024-01-10",
            "location": "A1-B2"
          }
        ]
      }
    ]
  }
}
```

---

### 3. PATCH `/warehouse/picking-tasks/:orderId/reset`
**Mô tả**: Hủy kết quả soạn hàng hiện tại và làm lại từ đầu  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Làm lại lượt soạn hàng thành công",
  "data": {
    "orderId": "uuid-string",
    "status": "approved"
  }
}
```

---

### 4. PATCH `/warehouse/shipments/finalize-bulk`
**Mô tả**: Duyệt & Xuất kho đơn hàng (Có thể gom nhiều đơn)  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| orders | array | ✅ | @IsArray, @ValidateNested, @ArrayMinSize(1), @ArrayMaxSize(10) | Danh sách đơn hàng (tối đa 10 đơn) |
| orders[].orderId | string (uuid) | ✅ | @IsUUID, @IsNotEmpty | ID đơn hàng |
| orders[].pickedItems | array | ✅ | @IsArray, @ValidateNested, @ArrayMinSize(1) | Danh sách lô hàng đã soạn cho đơn này |
| orders[].pickedItems[].batchId | number | ✅ | @IsNumber, @IsNotEmpty | ID lô hàng |
| orders[].pickedItems[].quantity | number | ✅ | @IsNumber, @Min(0.01), @IsNotEmpty | Số lượng đã soạn |

**Request Body Example**:
```json
{
  "orders": [
    {
      "orderId": "uuid-order-1",
      "pickedItems": [
        {
          "batchId": 123,
          "quantity": 50
        },
        {
          "batchId": 124,
          "quantity": 30
        }
      ]
    },
    {
      "orderId": "uuid-order-2",
      "pickedItems": [
        {
          "batchId": 125,
          "quantity": 100
        }
      ]
    }
  ]
}
```

**Validation Errors**:
- `Phải có ít nhất 1 đơn hàng`
- `Tối đa 10 đơn hàng trong một lần xuất kho`
- `Mỗi đơn phải có ít nhất 1 lô hàng`
- `Số lượng phải lớn hơn 0`

**Response**:
```json
{
  "statusCode": 200,
  "message": "Duyệt & Xuất kho đơn hàng thành công",
  "data": {
    "shipmentsCreated": [
      {
        "shipmentId": "uuid-shipment-1",
        "orderId": "uuid-order-1",
        "status": "in_transit"
      },
      {
        "shipmentId": "uuid-shipment-2",
        "orderId": "uuid-order-2",
        "status": "in_transit"
      }
    ]
  }
}
```

---

### 5. GET `/warehouse/shipments/:id/label`
**Mô tả**: Lấy dữ liệu in phiếu giao hàng  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy dữ liệu in phiếu giao hàng thành công",
  "data": {
    "shipmentId": "uuid-string",
    "orderId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "storeAddress": "123 Nguyen Thai Hoc, Q1, TP.HCM",
    "expectedDeliveryDate": "2024-01-05",
    "items": [
      {
        "productName": "Gà rán KFC Original",
        "batchCode": "GA-2024-001",
        "quantity": 10,
        "unit": "Kg",
        "expiryDate": "2024-01-10"
      }
    ],
    "qrCode": "https://cdn.com/qr-code.png"
  }
}
```

---

### 6. GET `/warehouse/scan-check?batchCode=GA-2024-001`
**Mô tả**: Kiểm tra nhanh thông tin lô hàng  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `batchCode` (required): Mã lô cần kiểm tra

**Response**:
```json
{
  "statusCode": 200,
  "message": "Kiểm tra thông tin lô hàng thành công",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "productId": 1,
    "productName": "Gà rán KFC Original",
    "currentQuantity": 50,
    "expiryDate": "2024-01-10",
    "location": "A1-B2",
    "status": "available"
  }
}
```

---

### 7. POST `/warehouse/batch/report-issue`
**Mô tả**: Báo cáo sự cố mặt hàng (Thiếu/Hỏng)  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| batchId | number | ✅ | @IsNumber, @Min(1), @IsNotEmpty | ID của Lô hàng bị lỗi |
| reason | string | ✅ | @IsString, @IsNotEmpty | Lý do: damaged, thiếu hụt, hỏng hóc... |

**Request Body Example**:
```json
{
  "batchId": 1,
  "reason": "damaged"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Báo cáo sự cố thành công",
  "data": {
    "batchId": 1,
    "reason": "damaged",
    "reportedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📥 Inbound Logistics APIs

### 1. POST `/inbound/receipts`
**Mô tả**: Khởi tạo phiếu nhập hàng mới từ nhà cung cấp  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| supplierId | number | ✅ | @IsNumber, @IsNotEmpty | ID nhà cung cấp |
| note | string | ⚪ | @IsString, @IsOptional | Ghi chú nhập hàng |

**Request Body Example**:
```json
{
  "supplierId": 1,
  "note": "Đợt nhập hàng định kỳ tuần 1"
}
```

**Validation Errors**:
- `ID nhà cung cấp không được để trống`

**Response**:
```json
{
  "statusCode": 201,
  "message": "Tạo biên lai nhập kho thành công",
  "data": {
    "receiptId": "uuid-string",
    "supplierId": 1,
    "status": "draft",
    "expectedDeliveryDate": "2024-01-05T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. GET `/inbound/receipts?status=draft&page=1&limit=20`
**Mô tả**: Xem danh sách tất cả các phiếu nhập hàng (Phân trang)  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): draft, completed
- `supplierId` (optional): Filter theo nhà cung cấp
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách phiếu nhập thành công",
  "data": {
    "items": [
      {
        "receiptId": "uuid-string",
        "supplierId": 1,
        "supplierName": "Công ty TNHH ABC",
        "status": "draft",
        "expectedDeliveryDate": "2024-01-05",
        "totalItems": 5,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 30,
    "page": 1,
    "limit": 20
  }
}
```

---

### 3. GET `/inbound/receipts/:id`
**Mô tả**: Xem thông tin chi tiết và danh sách hàng hóa của một phiếu nhập  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy thông tin phiếu nhập thành công",
  "data": {
    "receiptId": "uuid-string",
    "supplierId": 1,
    "supplierName": "Công ty TNHH ABC",
    "status": "draft",
    "expectedDeliveryDate": "2024-01-05",
    "items": [
      {
        "batchId": 1,
        "batchCode": "GA-2024-001",
        "productId": 1,
        "productName": "Gà rán KFC Original",
        "quantity": 100,
        "expiryDate": "2024-01-10T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 4. POST `/inbound/receipts/:id/items`
**Mô tả**: Khai báo hàng thực tế dỡ từ xe xuống vào phiếu nhập  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| productId | number | ✅ | @IsNumber, @IsNotEmpty | ID sản phẩm |
| quantity | number | ✅ | @IsNumber, @Min(0.1), @IsNotEmpty | Số lượng nhập (≥ 0.1) |

**Request Body Example**:
```json
{
  "productId": 1,
  "quantity": 100
}
```

**Response**:
```json
{
  "statusCode": 201,
  "message": "Thêm hàng vào biên lai thành công",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "productId": 1,
    "productName": "Gà rán KFC Original",
    "quantity": 100,
    "expiryDate": "2024-01-10T00:00:00.000Z"
  }
}
```

---

### 5. GET `/inbound/batches/:id/label`
**Mô tả**: Lấy thông tin mã QR của lô hàng vừa nhập để in tem nhãn  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy data in QRCode thành công",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "productName": "Gà rán KFC Original",
    "quantity": 100,
    "expiryDate": "2024-01-10",
    "qrCode": "https://cdn.com/qr-code.png",
    "qrCodeData": "GA-2024-001"
  }
}
```

---

### 6. PATCH `/inbound/receipts/:id/complete`
**Mô tả**: Xác nhận hoàn tất biên lai và chính thức nhập hàng vào kho  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Chốt phiếu thành công",
  "data": {
    "receiptId": "uuid-string",
    "status": "completed",
    "completedAt": "2024-01-01T10:30:00.000Z"
  }
}
```

---

### 7. DELETE `/inbound/items/:batchId`
**Mô tả**: Xóa một mặt hàng/lô hàng khỏi phiếu nhập (Chỉ khi phiếu còn ở trạng thái Nháp)  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Xóa lô hàng lỗi thành công"
}
```

---

### 8. POST `/inbound/batches/reprint`
**Mô tả**: Yêu cầu in lại tem cho lô hàng đã nhập  
**Quyền truy cập**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| batchId | number | ✅ | @IsNumber, @IsNotEmpty | ID lô hàng cần in lại |

**Request Body Example**:
```json
{
  "batchId": 1
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Yêu cầu in lại tem thành công",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "qrCode": "https://cdn.com/qr-code.png"
  }
}
```

---

## 🏭 Supplier Management APIs

### 1. POST `/suppliers`
**Mô tả**: Tạo mới nhà cung cấp  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | ✅ | @IsString, @IsNotEmpty | Tên nhà cung cấp |
| contactName | string | ⚪ | @IsString, @IsOptional | Tên người liên hệ đại diện |
| phone | string | ⚪ | @IsString, @IsOptional, @Matches(regex) | Số điện thoại (10 chữ số, VD: 0901234567) |
| address | string | ⚪ | @IsString, @IsOptional | Địa chỉ nhà cung cấp |
| isActive | boolean | ⚪ | @IsBoolean, @IsOptional | Trạng thái hoạt động (default: true) |

**Request Body Example**:
```json
{
  "name": "Công ty TNHH ABC",
  "contactName": "Nguyễn Văn A",
  "phone": "0901234567",
  "address": "123 Đường ABC, Q1, TP.HCM"
}
```

**Validation Errors**:
- `Tên nhà cung cấp không được để trống`
- `Số điện thoại không đúng định dạng (VD: 0901234567)` - Nếu cung cấp phone

**Response**:
```json
{
  "statusCode": 201,
  "message": "Tạo nhà cung cấp thành công",
  "data": {
    "id": 1,
    "name": "Công ty TNHH ABC",
    "contactName": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Đường ABC, Q1, TP.HCM",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. GET `/suppliers?search=ABC&page=1&limit=20`
**Mô tả**: Lấy danh sách nhà cung cấp (Phân trang)  
**Quyền truy cập**: All authenticated users  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): Tìm kiếm theo tên
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách nhà cung cấp thành công",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Công ty TNHH ABC",
        "contactName": "Nguyễn Văn A",
        "phone": "0901234567",
        "isActive": true
      }
    ],
    "total": 10,
    "page": 1,
    "limit": 20
  }
}
```

---

### 3. GET `/suppliers/:id`
**Mô tả**: Lấy chi tiết nhà cung cấp  
**Quyền truy cập**: All authenticated users  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Lấy thông tin nhà cung cấp thành công",
  "data": {
    "id": 1,
    "name": "Công ty TNHH ABC",
    "contactName": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Đường ABC, Q1, TP.HCM",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 4. PATCH `/suppliers/:id`
**Mô tả**: Cập nhật thông tin nhà cung cấp  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Request Body Example**:
```json
{
  "contactName": "Nguyễn Văn B",
  "phone": "0901234568"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Cập nhật nhà cung cấp thành công",
  "data": {
    "id": 1,
    "contactName": "Nguyễn Văn B",
    "phone": "0901234568",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 5. DELETE `/suppliers/:id`
**Mô tả**: Xóa nhà cung cấp  
**Quyền truy cập**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Xóa nhà cung cấp thành công"
}
```

---

## 📝 Common Response Format

### Success Response
Tất cả API trả về response theo format:
```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## ⚠️ Error Handling

### HTTP Status Codes
- `200` - OK: Request thành công
- `201` - Created: Tạo resource thành công
- `400` - Bad Request: Request không hợp lệ
- `401` - Unauthorized: Chưa xác thực
- `403` - Forbidden: Không có quyền truy cập
- `404` - Not Found: Resource không tồn tại
- `409` - Conflict: Xung đột dữ liệu
- `422` - Unprocessable Entity: Validation error
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Lỗi server

### Common Error Messages
```json
{
  "statusCode": 401,
  "message": "Unauthorized access",
  "error": "Unauthorized"
}
```

```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "error": "Unprocessable Entity",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

---

## 📌 Notes & References

### User Roles
- **ADMIN**: Quản trị viên - Full access to all features
- **MANAGER**: Người quản lý - Quản lý sản phẩm, kho, nhà cung cấp
- **SUPPLY_COORDINATOR**: Điều phối viên cung ứng - Duyệt đơn, xử lý khiếu nại
- **CENTRAL_KITCHEN_STAFF**: Nhân viên bếp trung tâm - Nhập hàng, soạn đơn, xuất kho
- **FRANCHISE_STORE_STAFF**: Nhân viên cửa hàng - Tạo đơn, nhận hàng, quản lý tồn kho

### Order Status
- `pending`: Chờ duyệt
- `approved`: Đã duyệt
- `rejected`: Từ chối
- `cancelled`: Đã hủy
- `in_progress`: Đang xử lý
- `completed`: Hoàn thành

### Claim Status
- `pending`: Chờ xử lý
- `approved`: Đã chấp nhận
- `rejected`: Từ chối

### Shipment Status
- `pending`: Đang chuẩn bị
- `in_transit`: Đang vận chuyển
- `received`: Đã nhận hàng
- `completed`: Hoàn thành

### Inventory Transaction Types
- `import`: Nhập kho
- `export`: Xuất kho
- `waste`: Hao hụt
- `adjustment`: Điều chỉnh
- `damage`: Hư hỏng

### Receipt Status
- `draft`: Nháp (Chưa hoàn tất)
- `completed`: Đã hoàn tất

### Authentication
Hầu hết các endpoints yêu cầu Bearer Token authentication. Thêm token vào header:
```
Authorization: Bearer <your_access_token>
```

### Rate Limiting
- Login: 5 requests/60s
- Refresh Token: 5 requests/60s
- Forgot Password: 5 requests/60s
- Reset Password: 1 request/60s

### Pagination
Các API hỗ trợ phân trang sử dụng parameters:
- `page`: Số trang (default: 1)
- `limit`: Số items per page (default: 10 hoặc 20 tùy endpoint)
- `offset`: Số items bỏ qua (alternative to page)

### Date Format
Tất cả dates sử dụng ISO 8601 format:
```
2024-01-01T00:00:00.000Z
```

### Business Rules
1. **FEFO (First Expired, First Out)**: Hệ thống tự động gợi ý lô hàng sắp hết hạn trước khi soạn hàng
2. **Auto Claim Creation**: Khi nhận hàng có báo cáo thiếu/hỏng, hệ thống tự động tạo claim
3. **Inventory Reservation**: Khi đơn hàng được approve, số lượng sẽ được giữ chỗ trong kho
4. **Batch Code Generation**: Mã lô được tự động sinh theo format: `{SKU-PREFIX}-{YEAR}-{SEQUENCE}`
5. **Expiry Date Calculation**: Hạn sử dụng = Ngày nhập + Shelf Life Days

---

**Generated on**: February 12, 2026  
**API Version**: 1.0.0  
**Base URL**: Configure based on your environment (Dev/Staging/Production)  
**Documentation**: This document covers all available API endpoints in WDP301 Warehouse & Distribution Management System

---

## 🔄 API Workflow Examples

### 1. Tạo đơn hàng và nhận hàng (End-to-end)
```
1. Franchise Staff: POST /orders/catalog → Xem sản phẩm
2. Franchise Staff: POST /orders → Tạo đơn hàng
3. Supply Coordinator: GET /orders/coordinator/:id/review → Review đơn
4. Supply Coordinator: PATCH /orders/coordinator/:id/approve → Duyệt đơn
5. Kitchen Staff: GET /warehouse/picking-tasks → Xem task soạn hàng
6. Kitchen Staff: GET /warehouse/picking-tasks/:id → Xem chi tiết + FEFO
7. Kitchen Staff: PATCH /warehouse/shipments/finalize-bulk → Xuất kho
8. Franchise Staff: GET /shipments/store/my → Xem hàng đang đến
9. Franchise Staff: POST /shipments/:id/receive → Nhận hàng
```

### 2. Nhập hàng từ nhà cung cấp
```
1. Kitchen Staff: POST /inbound/receipts → Tạo phiếu nhập
2. Kitchen Staff: POST /inbound/receipts/:id/items → Khai báo hàng (lặp lại cho mỗi sản phẩm)
3. Kitchen Staff: GET /inbound/batches/:id/label → In tem QR cho từng lô
4. Kitchen Staff: PATCH /inbound/receipts/:id/complete → Chốt phiếu → Cộng vào kho
```

### 3. Xử lý khiếu nại
```
1. Franchise Staff: POST /shipments/:id/receive → Nhận hàng (có báo cáo hỏng/thiếu)
   → System tự động tạo claim
2. Supply Coordinator: GET /claims → Xem danh sách claim
3. Supply Coordinator: GET /claims/:id → Xem chi tiết
4. Supply Coordinator: PATCH /claims/:id/resolve → Xử lý claim
```

---
