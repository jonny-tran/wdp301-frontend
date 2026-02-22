# API DOCUMENTATION - WDP301 WAREHOUSE & DISTRIBUTION MANAGEMENT SYSTEM (BACKEND MATCHED)

## ðŸ“‹ Má»¥c lá»¥c
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
## 🌐 Base URL & Versioning (Backend Matched)
- **Global Prefix**: `/wdp301-api`
- **API Version**: `/v1`
- **Base URL chuẩn**: `{DOMAIN}/wdp301-api/v1`
- **Swagger URL**: `{DOMAIN}/wdp301-api/docs`

**Ví dụ**:
- Login: `POST {DOMAIN}/wdp301-api/v1/auth/login`
- Lấy profile: `GET {DOMAIN}/wdp301-api/v1/auth/me`

---

## ðŸ“ Data Types & Validation Rules

### Common Data Types
- **string**: Chuá»—i kÃ½ tá»±
- **number**: Sá»‘ (integer hoáº·c float)
- **integer**: Sá»‘ nguyÃªn
- **boolean**: true/false
- **uuid**: UUID version 4 format
- **email**: Email format (example@domain.com)
- **url**: URL format (https://example.com)
- **date**: ISO 8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
- **enum**: GiÃ¡ trá»‹ trong táº­p há»£p cá»‘ Ä‘á»‹nh

### Validation Decorators
- **@IsNotEmpty()**: KhÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng (required)
- **@IsOptional()**: TrÆ°á»ng khÃ´ng báº¯t buá»™c (optional)
- **@IsString()**: Pháº£i lÃ  chuá»—i
- **@IsInt()**: Pháº£i lÃ  sá»‘ nguyÃªn
- **@IsNumber()**: Pháº£i lÃ  sá»‘
- **@IsPositive()**: Pháº£i lÃ  sá»‘ dÆ°Æ¡ng
- **@Min(n)**: GiÃ¡ trá»‹ tá»‘i thiá»ƒu lÃ  n
- **@Max(n)**: GiÃ¡ trá»‹ tá»‘i Ä‘a lÃ  n
- **@MinLength(n)**: Äá»™ dÃ i tá»‘i thiá»ƒu n kÃ½ tá»±
- **@MaxLength(n)**: Äá»™ dÃ i tá»‘i Ä‘a n kÃ½ tá»±
- **@IsEmail()**: Pháº£i lÃ  email há»£p lá»‡
- **@IsUrl()**: Pháº£i lÃ  URL há»£p lá»‡
- **@IsUUID()**: Pháº£i lÃ  UUID há»£p lá»‡
- **@IsEnum(enum)**: Pháº£i lÃ  giÃ¡ trá»‹ trong enum
- **@IsArray()**: Pháº£i lÃ  máº£ng
- **@IsDateString()**: Pháº£i lÃ  date string há»£p lá»‡

### Field Notation
- âœ… **Required**: Field báº¯t buá»™c, khÃ´ng Ä‘Æ°á»£c null/undefined
- âšª **Optional**: Field khÃ´ng báº¯t buá»™c, cÃ³ thá»ƒ bá» qua
- ðŸ”¢ **Type**: Kiá»ƒu dá»¯ liá»‡u
- ðŸ“ **Validation**: Quy táº¯c validate
- ðŸ’¡ **Example**: VÃ­ dá»¥ giÃ¡ trá»‹

### Common Query Parameters (for GET endpoints)

#### Pagination Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | âšª | 1 | Sá»‘ trang (â‰¥ 1) |
| limit | integer | âšª | 10 hoáº·c 20 | Sá»‘ items per page |
| offset | integer | âšª | 0 | Sá»‘ items bá» qua (alternative to page) |

#### Filter Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | âšª | TÃ¬m kiáº¿m theo tÃªn, SKU, etc. |
| searchTerm | string | âšª | Tá»« khÃ³a tÃ¬m kiáº¿m |
| status | enum | âšª | Lá»c theo tráº¡ng thÃ¡i |
| storeId | uuid | âšª | Lá»c theo cá»­a hÃ ng |
| warehouseId | integer | âšª | Lá»c theo kho |
| productId | integer | âšª | Lá»c theo sáº£n pháº©m |
| supplierId | integer | âšª | Lá»c theo nhÃ  cung cáº¥p |
| isActive | boolean | âšª | Lá»c theo tráº¡ng thÃ¡i hoáº¡t Ä‘á»™ng |
| date | string (date) | âšª | Lá»c theo ngÃ y |
| type | enum | âšª | Lá»c theo loáº¡i |

#### Sort Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sortBy | string | âšª | TrÆ°á»ng cáº§n sort (createdAt, name, etc.) |
| sortOrder | enum | âšª | ASC hoáº·c DESC |

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

#### Validation Error (400)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
    "errors": [
    {
      "field": "email",
      "constraints": {
        "isEmail": "Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng",
        "isNotEmpty": "Email khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng"
      }
    },
    {
      "field": "password",
      "constraints": {
        "minLength": "Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±"
      }
    }
  ]
}
```

### Auto-transform Behaviors
Backend tá»± Ä‘á»™ng xá»­ lÃ½ má»™t sá»‘ transformations:

1. **Email**: Tá»± Ä‘á»™ng `.trim()` vÃ  `.toLowerCase()`
2. **String fields**: Tá»± Ä‘á»™ng `.trim()` whitespace
3. **Enum values**: Tá»± Ä‘á»™ng `.toLowerCase()`
4. **UUID**: Tá»± Ä‘á»™ng `.trim()`

**Frontend nÃªn trim trÆ°á»›c khi gá»­i Ä‘á»ƒ trÃ¡nh validation errors**

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

**Usage**: Trong CreateUserDto, phÃ¢n quyá»n API

#### OrderStatus Enum
```typescript
enum OrderStatus {
  PENDING = 'pending',         // Chá» duyá»‡t
  APPROVED = 'approved',       // ÄÃ£ duyá»‡t
  REJECTED = 'rejected',       // Tá»« chá»‘i
  CANCELLED = 'cancelled',     // ÄÃ£ há»§y
  PICKING = 'picking',         // Äang soáº¡n hÃ ng
  DELIVERING = 'delivering',   // Äang giao hÃ ng
  COMPLETED = 'completed',     // HoÃ n thÃ nh
  CLAIMED = 'claimed'          // CÃ³ khiáº¿u náº¡i
}
```

**Usage**: Filter orders, order status updates

#### ShipmentStatus Enum
```typescript
enum ShipmentStatus {
  PREPARING = 'preparing',     // Äang chuáº©n bá»‹
  IN_TRANSIT = 'in_transit',   // Äang váº­n chuyá»ƒn
  DELIVERED = 'delivered',     // ÄÃ£ giao hÃ ng
  COMPLETED = 'completed',     // HoÃ n thÃ nh
  CANCELLED = 'cancelled'      // ÄÃ£ há»§y
}
```

**Usage**: Filter shipments, shipment tracking

#### ClaimStatus Enum
```typescript
enum ClaimStatus {
  PENDING = 'pending',         // Chá» xá»­ lÃ½
  APPROVED = 'approved',       // ÄÃ£ cháº¥p nháº­n
  REJECTED = 'rejected'        // Tá»« chá»‘i
}
```

**Usage**: Filter claims, resolve claims

#### TransactionType Enum
```typescript
enum TransactionType {
  IMPORT = 'import',           // Nháº­p kho
  EXPORT = 'export',           // Xuáº¥t kho
  WASTE = 'waste',             // Hao há»¥t
  ADJUSTMENT = 'adjustment'    // Äiá»u chá»‰nh
}
```

**Usage**: Filter inventory transactions

#### ReceiptStatus Enum
```typescript
enum ReceiptStatus {
  DRAFT = 'draft',             // NhÃ¡p (Ä‘ang soáº¡n)
  COMPLETED = 'completed',     // ÄÃ£ hoÃ n táº¥t
  CANCELLED = 'cancelled'      // ÄÃ£ há»§y
}
```

**Usage**: Filter inbound receipts

#### BatchStatus Enum
```typescript
enum BatchStatus {
  PENDING = 'pending',         // Chá» xá»­ lÃ½
  AVAILABLE = 'available',     // Sáºµn sÃ ng
  EMPTY = 'empty',             // Háº¿t hÃ ng
  EXPIRED = 'expired'          // Háº¿t háº¡n
}
```

**Usage**: Batch management, inventory tracking

#### WarehouseType Enum
```typescript
enum WarehouseType {
  CENTRAL = 'central',                // Kho trung tÃ¢m
  STORE_INTERNAL = 'store_internal'   // Kho cá»­a hÃ ng
}
```

**Usage**: Warehouse management

#### UserStatus Enum
```typescript
enum UserStatus {
  ACTIVE = 'active',           // Äang hoáº¡t Ä‘á»™ng
  BANNED = 'banned'            // Bá»‹ khÃ³a
}
```

**Usage**: User management

---

## ðŸ” Authentication APIs

### 1. POST `/auth/login`
**MÃ´ táº£**: ÄÄƒng nháº­p há»‡ thá»‘ng  
**Quyá»n truy cáº­p**: Public  
**Rate Limit**: 5 requests/60s

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| email | string | âœ… | @IsEmail, @IsNotEmpty | Email Ä‘Äƒng nháº­p (tá»± Ä‘á»™ng trim & lowercase) |
| password | string | âœ… | @IsNotEmpty, @MinLength(6) | Máº­t kháº©u (tá»‘i thiá»ƒu 6 kÃ½ tá»±) |

**Request Body Example**:
```json
{
  "email": "admin@gmail.com",
  "password": "pass123456789"
}
```

**Validation Errors**:
- `Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng` - Náº¿u email khÃ´ng há»£p lá»‡
- `Email khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng` - Náº¿u thiáº¿u email
- `Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng` - Náº¿u thiáº¿u password
- `Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±` - Náº¿u password < 6 kÃ½ tá»±

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
**MÃ´ táº£**: LÃ m má»›i Access Token  
**Quyá»n truy cáº­p**: Public  
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
**MÃ´ táº£**: Láº¥y thÃ´ng tin user hiá»‡n táº¡i  
**Quyá»n truy cáº­p**: Authenticated  
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
**MÃ´ táº£**: ÄÄƒng xuáº¥t (revoke refresh token)  
**Quyá»n truy cáº­p**: Authenticated  
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
**MÃ´ táº£**: Táº¡o tÃ i khoáº£n má»›i  
**Quyá»n truy cáº­p**: ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| username | string | âœ… | @IsString, @IsNotEmpty | TÃªn hiá»ƒn thá»‹ cá»§a nhÃ¢n viÃªn |
| email | string | âœ… | @IsEmail, @IsNotEmpty | Email Ä‘Äƒng nháº­p (unique, auto trim & lowercase) |
| password | string | âœ… | @IsString, @MinLength(6) | Máº­t kháº©u (tá»‘i thiá»ƒu 6 kÃ½ tá»±) |
| role | enum | âœ… | @IsEnum(UserRole) | Vai trÃ²: admin, manager, supply_coordinator, central_kitchen_staff, franchise_store_staff |
| storeId | uuid | âšª | @IsUUID(4), @IsOptional | ID cá»­a hÃ ng (Báº¯t buá»™c náº¿u role = franchise_store_staff) |

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
- `TÃªn hiá»ƒn thá»‹ pháº£i lÃ  chuá»—i kÃ½ tá»±` / `TÃªn hiá»ƒn thá»‹ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`
- `Email khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng` / `Email khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`
- `Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±`
- `Vai trÃ² khÃ´ng há»£p lá»‡` - Role pháº£i thuá»™c enum
- `Store ID pháº£i lÃ  UUID v4` - Náº¿u storeId khÃ´ng Ä‘Ãºng format

**Response**:
```json
{
  "statusCode": 201,
  "message": "Táº¡o tÃ i khoáº£n má»›i thÃ nh cÃ´ng",
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
**MÃ´ táº£**: Gá»­i OTP qua email Ä‘á»ƒ Ä‘áº·t láº¡i máº­t kháº©u  
**Quyá»n truy cáº­p**: Public  
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
  "message": "Gá»­i mÃ£ xÃ¡c thá»±c thÃ nh cÃ´ng"
}
```

---

### 7. POST `/auth/reset-password`
**MÃ´ táº£**: Äáº·t láº¡i máº­t kháº©u báº±ng OTP  
**Quyá»n truy cáº­p**: Public  
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
  "message": "Äáº·t láº¡i máº­t kháº©u thÃ nh cÃ´ng"
}
```

---

### 8. GET `/auth/roles`
**MÃ´ táº£**: Láº¥y danh sÃ¡ch vai trÃ² trong há»‡ thá»‘ng  
**Quyá»n truy cáº­p**: ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch vai trÃ² thÃ nh cÃ´ng",
  "data": [
    {
      "value": "admin",
      "label": "Quáº£n trá»‹ viÃªn"
    },
    {
      "value": "manager",
      "label": "NgÆ°á»i quáº£n lÃ½"
    },
    {
      "value": "supply_coordinator",
      "label": "Äiá»u phá»‘i viÃªn cung á»©ng"
    },
    {
      "value": "central_kitchen_staff",
      "label": "NhÃ¢n viÃªn báº¿p trung tÃ¢m"
    },
    {
      "value": "franchise_store_staff",
      "label": "NhÃ¢n viÃªn cá»­a hÃ ng"
    }
  ]
}
```

---

## ðŸ“¦ Order Management APIs

### 1. GET `/orders/catalog?isActive=true`
**MÃ´ táº£**: Láº¥y danh sÃ¡ch sáº£n pháº©m hiá»‡n cÃ³ trong catalog Ä‘á»ƒ táº¡o Ä‘Æ¡n hÃ ng  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `isActive` (optional): Filter sáº£n pháº©m Ä‘ang hoáº¡t Ä‘á»™ng

**Response**:
```json
{
  "statusCode": 200,
  "data": [
    {
      "productId": 1,
      "sku": "PROD-001",
      "name": "GÃ  rÃ¡n KFC Original",
      "unit": "Kg",
      "imageUrl": "https://cdn.com/image.jpg",
      "isAvailable": true
    }
  ]
}
```

---

### 2. POST `/orders`
**MÃ´ táº£**: Táº¡o Ä‘Æ¡n hÃ ng má»›i  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| deliveryDate | string (ISO date) | âœ… | @IsDateString, @IsNotEmpty, @IsFutureDate | NgÃ y giao hÃ ng (pháº£i >= ngÃ y mai, vÃ  trÆ°á»›c 22:00 náº¿u Ä‘áº·t cho ngÃ y mai) |
| items | array | âœ… | @IsArray, @ValidateNested | Danh sÃ¡ch sáº£n pháº©m Ä‘áº·t hÃ ng |
| items[].productId | integer | âœ… | @IsInt, @IsPositive | ID sáº£n pháº©m (pháº£i > 0) |
| items[].quantity | integer | âœ… | @IsInt, @IsPositive | Sá»‘ lÆ°á»£ng Ä‘áº·t (pháº£i > 0) |

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
- NgÃ y giao hÃ ng pháº£i lÃ  Ã­t nháº¥t 1 ngÃ y trong tÆ°Æ¡ng lai
- Náº¿u Ä‘áº·t hÃ ng sau 22:00, khÃ´ng thá»ƒ chá»n ngÃ y mai lÃ m ngÃ y giao
- Má»—i Ä‘Æ¡n pháº£i cÃ³ Ã­t nháº¥t 1 sáº£n pháº©m

**Validation Errors**:
- `NgÃ y giao hÃ ng khÃ´ng há»£p lá»‡` - Format khÃ´ng Ä‘Ãºng
- `ÄÆ¡n hÃ ng Ä‘áº·t sau 22:00 khÃ´ng thá»ƒ giao vÃ o ngÃ y mai`
- `NgÃ y giao hÃ ng pháº£i lÃ  Ã­t nháº¥t 1 ngÃ y trong tÆ°Æ¡ng lai`
- `ID sáº£n pháº©m pháº£i lÃ  sá»‘ nguyÃªn` / `ID sáº£n pháº©m pháº£i lÃ  sá»‘ dÆ°Æ¡ng`
- `Sá»‘ lÆ°á»£ng pháº£i lÃ  sá»‘ nguyÃªn` / `Sá»‘ lÆ°á»£ng pháº£i lÃ  sá»‘ dÆ°Æ¡ng`

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
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch Ä‘Æ¡n hÃ ng cá»§a cá»­a hÃ ng mÃ¬nh  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, approved, rejected, cancelled
- `page` (optional): Sá»‘ trang
- `limit` (optional): Sá»‘ lÆ°á»£ng items per page

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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch táº¥t cáº£ Ä‘Æ¡n hÃ ng (PhÃ¢n trang & Lá»c)  
**Quyá»n truy cáº­p**: MANAGER, SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `storeId` (optional): Filter theo cá»­a hÃ ng
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
**MÃ´ táº£**: Xem chi tiáº¿t Ä‘Æ¡n hÃ ng vÃ  so sÃ¡nh vá»›i tá»“n kho Ä‘á»ƒ duyá»‡t Ä‘Æ¡n  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, ADMIN  
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
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Duyá»‡t Ä‘Æ¡n hÃ ng  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, ADMIN  
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
**MÃ´ táº£**: Tá»« chá»‘i Ä‘Æ¡n hÃ ng  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, ADMIN  
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
**MÃ´ táº£**: Há»§y Ä‘Æ¡n hÃ ng (Chá»‰ franchise staff cÃ³ thá»ƒ há»§y Ä‘Æ¡n cá»§a mÃ¬nh)  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
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
**MÃ´ táº£**: Láº¥y thÃ´ng tin chi tiáº¿t Ä‘Æ¡n hÃ ng  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, FRANCHISE_STORE_STAFF, MANAGER, ADMIN  
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
        "productName": "GÃ  rÃ¡n KFC Original",
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

## ðŸš¨ Claim Management APIs

### 1. GET `/claims?status=pending&page=1&limit=20`
**MÃ´ táº£**: Láº¥y danh sÃ¡ch khiáº¿u náº¡i (PhÃ¢n trang & Lá»c)  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, MANAGER, ADMIN  
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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch khiáº¿u náº¡i cá»§a cá»­a hÃ ng mÃ¬nh  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF  
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
**MÃ´ táº£**: Láº¥y chi tiáº¿t khiáº¿u náº¡i  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, SUPPLY_COORDINATOR, CENTRAL_KITCHEN_STAFF  
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
    "description": "Má»™t sá»‘ sáº£n pháº©m bá»‹ hÆ° há»ng",
    "items": [
      {
        "productId": 1,
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Táº¡o khiáº¿u náº¡i thá»§ cÃ´ng  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| shipmentId | uuid | âœ… | @IsUUID, @IsNotEmpty | ID lÃ´ hÃ ng |
| description | string | âšª | @IsString, @IsOptional | MÃ´ táº£ chi tiáº¿t váº¥n Ä‘á» |
| items | array | âœ… | @IsArray, @ValidateNested | Danh sÃ¡ch sáº£n pháº©m khiáº¿u náº¡i |
| items[].productId | number | âœ… | @IsNumber, @IsNotEmpty | ID sáº£n pháº©m |
| items[].batchId | number | âœ… | @IsNumber, @IsNotEmpty | ID lÃ´ hÃ ng |
| items[].quantityMissing | number | âœ… | @IsNumber, @Min(0) | Sá»‘ lÆ°á»£ng thiáº¿u (â‰¥ 0) |
| items[].quantityDamaged | number | âœ… | @IsNumber, @Min(0) | Sá»‘ lÆ°á»£ng há»ng (â‰¥ 0) |
| items[].reason | string | âšª | @IsString, @IsOptional | LÃ½ do |
| items[].imageProofUrl | string | âšª | @IsString, @IsOptional | Link áº£nh báº±ng chá»©ng |

**Request Body Example**:
```json
{
  "shipmentId": "uuid-string",
  "description": "Má»™t sá»‘ sáº£n pháº©m bá»‹ hÆ° há»ng",
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
- `Sá»‘ lÆ°á»£ng thiáº¿u khÃ´ng Ä‘Æ°á»£c Ã¢m` - quantityMissing < 0
- `Sá»‘ lÆ°á»£ng hÃ ng há»ng khÃ´ng Ä‘Æ°á»£c Ã¢m` - quantityDamaged < 0

**Response**:
```json
{
  "statusCode": 201,
  "message": "Táº¡o khiáº¿u náº¡i thÃ nh cÃ´ng. Tá»“n kho Ä‘Ã£ Ä‘Æ°á»£c Ä‘iá»u chá»‰nh.",
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
**MÃ´ táº£**: Xá»­ lÃ½/Pháº£n há»“i khiáº¿u náº¡i  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "status": "approved",
  "resolutionNote": "ÄÃ£ xÃ¡c nháº­n vÃ  sáº½ hoÃ n tráº£"
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
    "resolutionNote": "ÄÃ£ xÃ¡c nháº­n vÃ  sáº½ hoÃ n tráº£",
    "resolvedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## ðŸª Franchise Store Management APIs

### 1. POST `/stores`
**MÃ´ táº£**: Táº¡o cá»­a hÃ ng franchise má»›i  
**Quyá»n truy cáº­p**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | âœ… | @IsString, @IsNotEmpty | TÃªn cá»­a hÃ ng |
| address | string | âœ… | @IsString, @IsNotEmpty | Äá»‹a chá»‰ cá»­a hÃ ng |
| phone | string | âšª | @IsString, @IsOptional | Sá»‘ Ä‘iá»‡n thoáº¡i liÃªn há»‡ |
| managerName | string | âšª | @IsString, @IsOptional | TÃªn ngÆ°á»i quáº£n lÃ½ |

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
- `TÃªn cá»­a hÃ ng khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`
- `Äá»‹a chá»‰ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`

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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch cá»­a hÃ ng  
**Quyá»n truy cáº­p**: MANAGER, SUPPLY_COORDINATOR  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): TÃ¬m kiáº¿m theo tÃªn hoáº·c Ä‘á»‹a chá»‰
- `isActive` (optional): Filter theo tráº¡ng thÃ¡i hoáº¡t Ä‘á»™ng

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
**MÃ´ táº£**: Láº¥y chi tiáº¿t cá»­a hÃ ng  
**Quyá»n truy cáº­p**: MANAGER  
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
**MÃ´ táº£**: Cáº­p nháº­t thÃ´ng tin cá»­a hÃ ng  
**Quyá»n truy cáº­p**: MANAGER  
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
**MÃ´ táº£**: XÃ³a cá»­a hÃ ng  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Store deleted successfully"
}
```

---

## ðŸ“Š Inventory Management APIs

### 1. GET `/inventory/store?search=&page=1&limit=20`
**MÃ´ táº£**: Xem tá»“n kho táº¡i cá»­a hÃ ng cá»§a mÃ¬nh  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): TÃ¬m kiáº¿m theo tÃªn sáº£n pháº©m
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
      "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Xem lá»‹ch sá»­ giao dá»‹ch kho cá»§a cá»­a hÃ ng  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
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
        "productName": "GÃ  rÃ¡n KFC Original",
        "batchCode": "GA-2024-001",
        "quantity": 100,
        "date": "2024-01-01T00:00:00.000Z",
        "note": "Nháº­p hÃ ng tá»« shipment #123"
      }
    ],
    "total": 50,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 3. GET `/inventory/summary?warehouseId=1&page=1&limit=20&searchTerm=gÃ `
**MÃ´ táº£**: Tá»•ng há»£p tá»“n kho (DÃ nh cho Manager Ä‘á»ƒ xem tá»•ng quan)  
**Quyá»n truy cáº­p**: MANAGER, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `warehouseId` (optional): Filter theo kho
- `searchTerm` (optional): TÃ¬m kiáº¿m sáº£n pháº©m
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
        "productName": "GÃ  rÃ¡n KFC Original",
        "sku": "PROD-001",
        "totalQuantity": 500,
        "unit": "Kg",
        "warehouses": [
          {
            "warehouseId": 1,
            "warehouseName": "Kho trung tÃ¢m",
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
**MÃ´ táº£**: Cáº£nh bÃ¡o tá»“n kho tháº¥p  
**Quyá»n truy cáº­p**: MANAGER, ADMIN  
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
      "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Äiá»u chá»‰nh tá»“n kho (Xá»­ lÃ½ hÃ ng há»ng, máº¥t mÃ¡t, v.v.)  
**Quyá»n truy cáº­p**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| warehouseId | number | âœ… | - | ID kho cáº§n Ä‘iá»u chá»‰nh |
| batchId | number | âœ… | - | ID lÃ´ hÃ ng |
| adjustmentQuantity | number | âœ… | - | Sá»‘ lÆ°á»£ng Ä‘iá»u chá»‰nh (dÆ°Æ¡ng: tÄƒng, Ã¢m: giáº£m) |
| reason | string | âœ… | - | LÃ½ do Ä‘iá»u chá»‰nh (damaged, waste, found, correction, etc.) |
| note | string | âšª | - | Ghi chÃº bá»• sung |

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
- `damaged` - HÃ ng há»ng
- `waste` - Hao há»¥t
- `found` - PhÃ¡t hiá»‡n thÃªm hÃ ng
- `correction` - Sá»­a lá»—i Ä‘áº¿m kho
- `expired` - QuÃ¡ háº¡n sá»­ dá»¥ng

**Validation Errors**:
- Táº¥t cáº£ cÃ¡c field báº¯t buá»™c (trá»« note) Ä‘á»u pháº£i cÃ³ giÃ¡ trá»‹

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

### 6. GET `/inventory/kitchen/summary?page=1&limit=20&search=gÃ `
**MÃ´ táº£**: Xem tá»•ng tá»“n kho Báº¿p trung tÃ¢m (Group by Product)  
**Quyá»n truy cáº­p**: MANAGER, CENTRAL_KITCHEN_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): TÃ¬m kiáº¿m theo tÃªn sáº£n pháº©m
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
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Xem chi tiáº¿t lÃ´ hÃ ng cá»§a má»™t mÃ³n (Drill-down)  
**Quyá»n truy cáº­p**: MANAGER, CENTRAL_KITCHEN_STAFF, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `product_id` (required): ID cá»§a sáº£n pháº©m

**Response**:
```json
{
  "statusCode": 200,
  "data": {
    "productId": 1,
    "productName": "GÃ  rÃ¡n KFC Original",
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

## ðŸ— Product & Batch Management APIs

### 1. POST `/products`
**MÃ´ táº£**: Táº¡o sáº£n pháº©m má»›i  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | âœ… | @IsString, @IsNotEmpty | TÃªn sáº£n pháº©m |
| baseUnitId | integer | âœ… | @IsInt, @Min(1) | ID Ä‘Æ¡n vá»‹ tÃ­nh (â‰¥ 1) |
| shelfLifeDays | integer | âœ… | @IsInt, @Min(1) | Háº¡n sá»­ dá»¥ng - sá»‘ ngÃ y (â‰¥ 1) |
| imageUrl | string (url) | âœ… | @IsUrl, @IsNotEmpty | ÄÆ°á»ng dáº«n áº£nh sáº£n pháº©m (pháº£i lÃ  URL há»£p lá»‡) |

**Request Body Example**:
```json
{
  "name": "GÃ  rÃ¡n KFC Original",
  "baseUnitId": 1,
  "shelfLifeDays": 3,
  "imageUrl": "https://cdn.com/image.jpg"
}
```

**Validation Errors**:
- `TÃªn sáº£n pháº©m khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`
- `ID Ä‘Æ¡n vá»‹ tÃ­nh pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng`
- `Háº¡n sá»­ dá»¥ng pháº£i lÃ  sá»‘ nguyÃªn dÆ°Æ¡ng`
- `ÄÆ°á»ng dáº«n áº£nh khÃ´ng há»£p lá»‡` - Pháº£i lÃ  URL

**Response**:
```json
{
  "statusCode": 201,
  "message": "Táº¡o sáº£n pháº©m thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "name": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch sáº£n pháº©m (PhÃ¢n trang)  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token  
**Query Parameters**:
- `page` (optional): Default 1
- `limit` (optional): Default 10
- `search` (optional): TÃ¬m kiáº¿m theo tÃªn hoáº·c SKU

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch sáº£n pháº©m thÃ nh cÃ´ng",
  "data": {
    "items": [
      {
        "id": 1,
        "sku": "PROD-001",
        "name": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch lÃ´ hÃ ng (PhÃ¢n trang)  
**Quyá»n truy cáº­p**: MANAGER, CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `page` (optional): Default 1
- `limit` (optional): Default 10
- `productId` (optional): Filter theo sáº£n pháº©m
- `expiryDate` (optional): Filter theo ngÃ y háº¿t háº¡n

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch lÃ´ hÃ ng thÃ nh cÃ´ng",
  "data": {
    "items": [
      {
        "id": 1,
        "batchCode": "GA-2024-001",
        "productId": 1,
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Láº¥y chi tiáº¿t sáº£n pháº©m  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y thÃ´ng tin sáº£n pháº©m thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "sku": "PROD-001",
    "name": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Cáº­p nháº­t thÃ´ng tin sáº£n pháº©m  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Request Body**:
```json
{
  "name": "GÃ  rÃ¡n KFC Original - Updated",
  "shelfLifeDays": 5
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Cáº­p nháº­t sáº£n pháº©m thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "name": "GÃ  rÃ¡n KFC Original - Updated",
    "shelfLifeDays": 5,
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 6. DELETE `/products/:id`
**MÃ´ táº£**: XÃ³a sáº£n pháº©m (Soft delete)  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "XÃ³a sáº£n pháº©m thÃ nh cÃ´ng"
}
```

---

### 7. PATCH `/products/:id/restore`
**MÃ´ táº£**: KhÃ´i phá»¥c sáº£n pháº©m Ä‘Ã£ xÃ³a  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "KhÃ´i phá»¥c sáº£n pháº©m thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "isActive": true,
    "restoredAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 8. GET `/products/batches/:id`
**MÃ´ táº£**: Láº¥y chi tiáº¿t lÃ´ hÃ ng  
**Quyá»n truy cáº­p**: MANAGER, CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y chi tiáº¿t lÃ´ hÃ ng thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "batchCode": "GA-2024-001",
    "productId": 1,
    "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Cáº­p nháº­t thÃ´ng tin lÃ´ hÃ ng  
**Quyá»n truy cáº­p**: MANAGER, CENTRAL_KITCHEN_STAFF  
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
  "message": "Cáº­p nháº­t lÃ´ hÃ ng thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "initialQuantity": 120,
    "imageUrl": "https://cdn.com/batch-updated.jpg",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

## ðŸšš Shipment Management APIs

### 1. GET `/shipments?status=in_transit&storeId=uuid&page=1&limit=20`
**MÃ´ táº£**: Láº¥y danh sÃ¡ch lÃ´ hÃ ng (PhÃ¢n trang & Lá»c)  
**Quyá»n truy cáº­p**: MANAGER, SUPPLY_COORDINATOR, ADMIN  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, in_transit, received, completed
- `storeId` (optional): Filter theo cá»­a hÃ ng
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch lÃ´ hÃ ng thÃ nh cÃ´ng",
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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch lÃ´ hÃ ng cá»§a cá»­a hÃ ng mÃ¬nh  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): pending, in_transit, received, completed

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch lÃ´ hÃ ng thÃ nh cÃ´ng",
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
**MÃ´ táº£**: Láº¥y chi tiáº¿t lÃ´ hÃ ng  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y chi tiáº¿t lÃ´ hÃ ng thÃ nh cÃ´ng",
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
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Láº¥y danh sÃ¡ch nháº·t hÃ ng (Picking List) cho lÃ´ hÃ ng  
**Quyá»n truy cáº­p**: SUPPLY_COORDINATOR, CENTRAL_KITCHEN_STAFF, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch nháº·t hÃ ng thÃ nh cÃ´ng",
  "data": {
    "shipmentId": "uuid-string",
    "orderId": "uuid-string",
    "items": [
      {
        "productId": 1,
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Nháº­n hÃ ng nhanh (Äá»§ hÃ ng, khÃ´ng há»ng)  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Nháº­n hÃ ng thÃ nh cÃ´ng (Äá»§ hÃ ng)",
  "data": {
    "shipmentId": "uuid-string",
    "status": "received",
    "receivedAt": "2024-01-05T10:30:00.000Z"
  }
}
```

---

### 6. POST `/shipments/:id/receive`
**MÃ´ táº£**: Nháº­n hÃ ng chi tiáº¿t (BÃ¡o cÃ¡o thiáº¿u/há»ng)  
**Quyá»n truy cáº­p**: FRANCHISE_STORE_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| items | array | âœ… | @IsArray, @ValidateNested | Danh sÃ¡ch lÃ´ hÃ ng nháº­n |
| items[].batchId | integer | âœ… | @IsInt, @IsPositive | ID cá»§a batch (lÃ´ hÃ ng) |
| items[].actualQty | number | âœ… | @IsNumber, @Min(0) | Sá»‘ lÆ°á»£ng thá»±c táº¿ nháº­n Ä‘Æ°á»£c (â‰¥ 0) |
| items[].damagedQty | number | âœ… | @IsNumber, @Min(0) | Sá»‘ lÆ°á»£ng hÃ ng há»ng (â‰¥ 0) |
| items[].evidenceUrls | array<string> | âšª | @IsArray, @IsString(each), @IsOptional | Danh sÃ¡ch link áº£nh báº±ng chá»©ng |
| notes | string | âšª | @IsString, @IsOptional | Ghi chÃº khi nháº­n hÃ ng |
| evidenceUrls | array<string> | âšª | @IsArray, @IsString(each), @IsOptional | áº¢nh báº±ng chá»©ng chung |

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
  "notes": "HÃ ng Ä‘Ã£ nháº­n Ä‘áº§y Ä‘á»§",
  "evidenceUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Business Rules**:
- Náº¿u cÃ³ hÃ ng há»ng hoáº·c thiáº¿u, há»‡ thá»‘ng tá»± Ä‘á»™ng táº¡o claim
- actualQty + damagedQty <= Sá»‘ lÆ°á»£ng gá»­i ban Ä‘áº§u
- NÃªn Ä‘Ã­nh kÃ¨m áº£nh báº±ng chá»©ng náº¿u cÃ³ váº¥n Ä‘á»

**Validation Errors**:
- `Sá»‘ lÆ°á»£ng thá»±c nháº­n khÃ´ng Ä‘Æ°á»£c Ã¢m`
- `Sá»‘ lÆ°á»£ng hÃ ng há»ng khÃ´ng Ä‘Æ°á»£c Ã¢m`

**Response**:
```json
{
  "statusCode": 200,
  "message": "XÃ¡c nháº­n nháº­n hÃ ng thÃ nh cÃ´ng",
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

## ðŸ­ Warehouse Operations APIs

### 1. GET `/warehouse/picking-tasks?date=2024-01-05&page=1&limit=20`
**MÃ´ táº£**: Láº¥y danh sÃ¡ch tÃ¡c vá»¥ soáº¡n hÃ ng (PhÃ¢n trang)  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `date` (optional): Filter theo ngÃ y giao hÃ ng
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch tÃ¡c vá»¥ soáº¡n hÃ ng thÃ nh cÃ´ng",
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
**MÃ´ táº£**: Xem chi tiáº¿t danh sÃ¡ch máº·t hÃ ng vÃ  lÃ´ hÃ ng gá»£i Ã½ cáº§n soáº¡n (FEFO)  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y chi tiáº¿t danh sÃ¡ch soáº¡n hÃ ng thÃ nh cÃ´ng",
  "data": {
    "orderId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "items": [
      {
        "productId": 1,
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Há»§y káº¿t quáº£ soáº¡n hÃ ng hiá»‡n táº¡i vÃ  lÃ m láº¡i tá»« Ä‘áº§u  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "LÃ m láº¡i lÆ°á»£t soáº¡n hÃ ng thÃ nh cÃ´ng",
  "data": {
    "orderId": "uuid-string",
    "status": "approved"
  }
}
```

---

### 4. PATCH `/warehouse/shipments/finalize-bulk`
**MÃ´ táº£**: Duyá»‡t & Xuáº¥t kho Ä‘Æ¡n hÃ ng (CÃ³ thá»ƒ gom nhiá»u Ä‘Æ¡n)  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| orders | array | âœ… | @IsArray, @ValidateNested, @ArrayMinSize(1), @ArrayMaxSize(10) | Danh sÃ¡ch Ä‘Æ¡n hÃ ng (tá»‘i Ä‘a 10 Ä‘Æ¡n) |
| orders[].orderId | string (uuid) | âœ… | @IsUUID, @IsNotEmpty | ID Ä‘Æ¡n hÃ ng |
| orders[].pickedItems | array | âœ… | @IsArray, @ValidateNested, @ArrayMinSize(1) | Danh sÃ¡ch lÃ´ hÃ ng Ä‘Ã£ soáº¡n cho Ä‘Æ¡n nÃ y |
| orders[].pickedItems[].batchId | number | âœ… | @IsNumber, @IsNotEmpty | ID lÃ´ hÃ ng |
| orders[].pickedItems[].quantity | number | âœ… | @IsNumber, @Min(0.01), @IsNotEmpty | Sá»‘ lÆ°á»£ng Ä‘Ã£ soáº¡n |

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
- `Pháº£i cÃ³ Ã­t nháº¥t 1 Ä‘Æ¡n hÃ ng`
- `Tá»‘i Ä‘a 10 Ä‘Æ¡n hÃ ng trong má»™t láº§n xuáº¥t kho`
- `Má»—i Ä‘Æ¡n pháº£i cÃ³ Ã­t nháº¥t 1 lÃ´ hÃ ng`
- `Sá»‘ lÆ°á»£ng pháº£i lá»›n hÆ¡n 0`

**Response**:
```json
{
  "statusCode": 200,
  "message": "Duyá»‡t & Xuáº¥t kho Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng",
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
**MÃ´ táº£**: Láº¥y dá»¯ liá»‡u in phiáº¿u giao hÃ ng  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y dá»¯ liá»‡u in phiáº¿u giao hÃ ng thÃ nh cÃ´ng",
  "data": {
    "shipmentId": "uuid-string",
    "orderId": "uuid-string",
    "storeName": "KFC Nguyen Thai Hoc",
    "storeAddress": "123 Nguyen Thai Hoc, Q1, TP.HCM",
    "expectedDeliveryDate": "2024-01-05",
    "items": [
      {
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Kiá»ƒm tra nhanh thÃ´ng tin lÃ´ hÃ ng  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `batchCode` (required): MÃ£ lÃ´ cáº§n kiá»ƒm tra

**Response**:
```json
{
  "statusCode": 200,
  "message": "Kiá»ƒm tra thÃ´ng tin lÃ´ hÃ ng thÃ nh cÃ´ng",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "productId": 1,
    "productName": "GÃ  rÃ¡n KFC Original",
    "currentQuantity": 50,
    "expiryDate": "2024-01-10",
    "location": "A1-B2",
    "status": "available"
  }
}
```

---

### 7. POST `/warehouse/batch/report-issue`
**MÃ´ táº£**: BÃ¡o cÃ¡o sá»± cá»‘ máº·t hÃ ng (Thiáº¿u/Há»ng)  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| batchId | number | âœ… | @IsNumber, @Min(1), @IsNotEmpty | ID cá»§a LÃ´ hÃ ng bá»‹ lá»—i |
| reason | string | âœ… | @IsString, @IsNotEmpty | LÃ½ do: damaged, thiáº¿u há»¥t, há»ng hÃ³c... |

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
  "message": "BÃ¡o cÃ¡o sá»± cá»‘ thÃ nh cÃ´ng",
  "data": {
    "batchId": 1,
    "reason": "damaged",
    "reportedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## ðŸ“¥ Inbound Logistics APIs

### 1. POST `/inbound/receipts`
**MÃ´ táº£**: Khá»Ÿi táº¡o phiáº¿u nháº­p hÃ ng má»›i tá»« nhÃ  cung cáº¥p  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| supplierId | number | âœ… | @IsNumber, @IsNotEmpty | ID nhÃ  cung cáº¥p |
| note | string | âšª | @IsString, @IsOptional | Ghi chÃº nháº­p hÃ ng |

**Request Body Example**:
```json
{
  "supplierId": 1,
  "note": "Äá»£t nháº­p hÃ ng Ä‘á»‹nh ká»³ tuáº§n 1"
}
```

**Validation Errors**:
- `ID nhÃ  cung cáº¥p khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`

**Response**:
```json
{
  "statusCode": 201,
  "message": "Táº¡o biÃªn lai nháº­p kho thÃ nh cÃ´ng",
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
**MÃ´ táº£**: Xem danh sÃ¡ch táº¥t cáº£ cÃ¡c phiáº¿u nháº­p hÃ ng (PhÃ¢n trang)  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token  
**Query Parameters**:
- `status` (optional): draft, completed
- `supplierId` (optional): Filter theo nhÃ  cung cáº¥p
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch phiáº¿u nháº­p thÃ nh cÃ´ng",
  "data": {
    "items": [
      {
        "receiptId": "uuid-string",
        "supplierId": 1,
        "supplierName": "CÃ´ng ty TNHH ABC",
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
**MÃ´ táº£**: Xem thÃ´ng tin chi tiáº¿t vÃ  danh sÃ¡ch hÃ ng hÃ³a cá»§a má»™t phiáº¿u nháº­p  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y thÃ´ng tin phiáº¿u nháº­p thÃ nh cÃ´ng",
  "data": {
    "receiptId": "uuid-string",
    "supplierId": 1,
    "supplierName": "CÃ´ng ty TNHH ABC",
    "status": "draft",
    "expectedDeliveryDate": "2024-01-05",
    "items": [
      {
        "batchId": 1,
        "batchCode": "GA-2024-001",
        "productId": 1,
        "productName": "GÃ  rÃ¡n KFC Original",
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
**MÃ´ táº£**: Khai bÃ¡o hÃ ng thá»±c táº¿ dá»¡ tá»« xe xuá»‘ng vÃ o phiáº¿u nháº­p  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| productId | number | âœ… | @IsNumber, @IsNotEmpty | ID sáº£n pháº©m |
| quantity | number | âœ… | @IsNumber, @Min(0.1), @IsNotEmpty | Sá»‘ lÆ°á»£ng nháº­p (â‰¥ 0.1) |

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
  "message": "ThÃªm hÃ ng vÃ o biÃªn lai thÃ nh cÃ´ng",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "productId": 1,
    "productName": "GÃ  rÃ¡n KFC Original",
    "quantity": 100,
    "expiryDate": "2024-01-10T00:00:00.000Z"
  }
}
```

---

### 5. GET `/inbound/batches/:id/label`
**MÃ´ táº£**: Láº¥y thÃ´ng tin mÃ£ QR cá»§a lÃ´ hÃ ng vá»«a nháº­p Ä‘á»ƒ in tem nhÃ£n  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y data in QRCode thÃ nh cÃ´ng",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "productName": "GÃ  rÃ¡n KFC Original",
    "quantity": 100,
    "expiryDate": "2024-01-10",
    "qrCode": "https://cdn.com/qr-code.png",
    "qrCodeData": "GA-2024-001"
  }
}
```

---

### 6. PATCH `/inbound/receipts/:id/complete`
**MÃ´ táº£**: XÃ¡c nháº­n hoÃ n táº¥t biÃªn lai vÃ  chÃ­nh thá»©c nháº­p hÃ ng vÃ o kho  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Chá»‘t phiáº¿u thÃ nh cÃ´ng",
  "data": {
    "receiptId": "uuid-string",
    "status": "completed",
    "completedAt": "2024-01-01T10:30:00.000Z"
  }
}
```

---

### 7. DELETE `/inbound/items/:batchId`
**MÃ´ táº£**: XÃ³a má»™t máº·t hÃ ng/lÃ´ hÃ ng khá»i phiáº¿u nháº­p (Chá»‰ khi phiáº¿u cÃ²n á»Ÿ tráº¡ng thÃ¡i NhÃ¡p)  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "XÃ³a lÃ´ hÃ ng lá»—i thÃ nh cÃ´ng"
}
```

---

### 8. POST `/inbound/batches/reprint`
**MÃ´ táº£**: YÃªu cáº§u in láº¡i tem cho lÃ´ hÃ ng Ä‘Ã£ nháº­p  
**Quyá»n truy cáº­p**: CENTRAL_KITCHEN_STAFF  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| batchId | number | âœ… | @IsNumber, @IsNotEmpty | ID lÃ´ hÃ ng cáº§n in láº¡i |

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
  "message": "YÃªu cáº§u in láº¡i tem thÃ nh cÃ´ng",
  "data": {
    "batchId": 1,
    "batchCode": "GA-2024-001",
    "qrCode": "https://cdn.com/qr-code.png"
  }
}
```

---

## ðŸ­ Supplier Management APIs

### 1. POST `/suppliers`
**MÃ´ táº£**: Táº¡o má»›i nhÃ  cung cáº¥p  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | âœ… | @IsString, @IsNotEmpty | TÃªn nhÃ  cung cáº¥p |
| contactName | string | âšª | @IsString, @IsOptional | TÃªn ngÆ°á»i liÃªn há»‡ Ä‘áº¡i diá»‡n |
| phone | string | âšª | @IsString, @IsOptional, @Matches(regex) | Sá»‘ Ä‘iá»‡n thoáº¡i (10 chá»¯ sá»‘, VD: 0901234567) |
| address | string | âšª | @IsString, @IsOptional | Äá»‹a chá»‰ nhÃ  cung cáº¥p |
| isActive | boolean | âšª | @IsBoolean, @IsOptional | Tráº¡ng thÃ¡i hoáº¡t Ä‘á»™ng (default: true) |

**Request Body Example**:
```json
{
  "name": "CÃ´ng ty TNHH ABC",
  "contactName": "Nguyá»…n VÄƒn A",
  "phone": "0901234567",
  "address": "123 ÄÆ°á»ng ABC, Q1, TP.HCM"
}
```

**Validation Errors**:
- `TÃªn nhÃ  cung cáº¥p khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng`
- `Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng Ä‘Ãºng Ä‘á»‹nh dáº¡ng (VD: 0901234567)` - Náº¿u cung cáº¥p phone

**Response**:
```json
{
  "statusCode": 201,
  "message": "Táº¡o nhÃ  cung cáº¥p thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "name": "CÃ´ng ty TNHH ABC",
    "contactName": "Nguyá»…n VÄƒn A",
    "phone": "0901234567",
    "address": "123 ÄÆ°á»ng ABC, Q1, TP.HCM",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. GET `/suppliers?search=ABC&page=1&limit=20`
**MÃ´ táº£**: Láº¥y danh sÃ¡ch nhÃ  cung cáº¥p (PhÃ¢n trang)  
**Quyá»n truy cáº­p**: All authenticated users  
**Authentication**: Bearer Token  
**Query Parameters**:
- `search` (optional): TÃ¬m kiáº¿m theo tÃªn
- `page` (optional): Default 1
- `limit` (optional): Default 20

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y danh sÃ¡ch nhÃ  cung cáº¥p thÃ nh cÃ´ng",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "CÃ´ng ty TNHH ABC",
        "contactName": "Nguyá»…n VÄƒn A",
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
**MÃ´ táº£**: Láº¥y chi tiáº¿t nhÃ  cung cáº¥p  
**Quyá»n truy cáº­p**: All authenticated users  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Láº¥y thÃ´ng tin nhÃ  cung cáº¥p thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "name": "CÃ´ng ty TNHH ABC",
    "contactName": "Nguyá»…n VÄƒn A",
    "phone": "0901234567",
    "address": "123 ÄÆ°á»ng ABC, Q1, TP.HCM",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 4. PATCH `/suppliers/:id`
**MÃ´ táº£**: Cáº­p nháº­t thÃ´ng tin nhÃ  cung cáº¥p  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Request Body Example**:
```json
{
  "contactName": "Nguyá»…n VÄƒn B",
  "phone": "0901234568"
}
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Cáº­p nháº­t nhÃ  cung cáº¥p thÃ nh cÃ´ng",
  "data": {
    "id": 1,
    "contactName": "Nguyá»…n VÄƒn B",
    "phone": "0901234568",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### 5. DELETE `/suppliers/:id`
**MÃ´ táº£**: XÃ³a nhÃ  cung cáº¥p  
**Quyá»n truy cáº­p**: MANAGER  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "XÃ³a nhÃ  cung cáº¥p thÃ nh cÃ´ng"
}
```

---

## ðŸ“ Common Response Format

### Success Response
Táº¥t cáº£ API tráº£ vá» response theo format (theo `TransformInterceptor`):
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/orders"
}
```

### Error Response
Format lỗi theo `HttpExceptionFilter`:
```json
{
  "statusCode": 400,
  "message": "Dữ liệu đầu vào không hợp lệ",
  "errors": [
    {
      "field": "email",
      "message": "Email không đúng định dạng"
    }
  ],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/auth/login"
}
```

---

## âš ï¸ Error Handling

### HTTP Status Codes
- `200` - OK: Request thÃ nh cÃ´ng
- `201` - Created: Táº¡o resource thÃ nh cÃ´ng
- `400` - Bad Request: Request khÃ´ng há»£p lá»‡
- `401` - Unauthorized: ChÆ°a xÃ¡c thá»±c
- `403` - Forbidden: KhÃ´ng cÃ³ quyá»n truy cáº­p
- `404` - Not Found: Resource khÃ´ng tá»“n táº¡i
- `409` - Conflict: Xung Ä‘á»™t dá»¯ liá»‡u
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Lá»—i server

### Common Error Messages
```json
{
  "statusCode": 401,
  "message": "Chưa đăng nhập",
  "errors": [],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/auth/me"
}
```

```json
{
  "statusCode": 403,
  "message": "Bạn không có quyền truy cập resource này",
  "errors": [],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/orders"
}
```

```json
{
  "statusCode": 404,
  "message": "Không tìm thấy tài nguyên được yêu cầu",
  "errors": [],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/unknown"
}
```

```json
{
  "statusCode": 400,
  "message": "Validation failed",
    "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

---

## ðŸ“Œ Notes & References

### User Roles
- **ADMIN**: Quáº£n trá»‹ viÃªn - Full access to all features
- **MANAGER**: NgÆ°á»i quáº£n lÃ½ - Quáº£n lÃ½ sáº£n pháº©m, kho, nhÃ  cung cáº¥p
- **SUPPLY_COORDINATOR**: Äiá»u phá»‘i viÃªn cung á»©ng - Duyá»‡t Ä‘Æ¡n, xá»­ lÃ½ khiáº¿u náº¡i
- **CENTRAL_KITCHEN_STAFF**: NhÃ¢n viÃªn báº¿p trung tÃ¢m - Nháº­p hÃ ng, soáº¡n Ä‘Æ¡n, xuáº¥t kho
- **FRANCHISE_STORE_STAFF**: NhÃ¢n viÃªn cá»­a hÃ ng - Táº¡o Ä‘Æ¡n, nháº­n hÃ ng, quáº£n lÃ½ tá»“n kho

### Order Status
- `pending`: Chá» duyá»‡t
- `approved`: ÄÃ£ duyá»‡t
- `rejected`: Tá»« chá»‘i
- `cancelled`: ÄÃ£ há»§y
- `in_progress`: Äang xá»­ lÃ½
- `completed`: HoÃ n thÃ nh

### Claim Status
- `pending`: Chá» xá»­ lÃ½
- `approved`: ÄÃ£ cháº¥p nháº­n
- `rejected`: Tá»« chá»‘i

### Shipment Status
- `pending`: Äang chuáº©n bá»‹
- `in_transit`: Äang váº­n chuyá»ƒn
- `received`: ÄÃ£ nháº­n hÃ ng
- `completed`: HoÃ n thÃ nh

### Inventory Transaction Types
- `import`: Nháº­p kho
- `export`: Xuáº¥t kho
- `waste`: Hao há»¥t
- `adjustment`: Äiá»u chá»‰nh
- `damage`: HÆ° há»ng

### Receipt Status
- `draft`: NhÃ¡p (ChÆ°a hoÃ n táº¥t)
- `completed`: ÄÃ£ hoÃ n táº¥t

### Authentication
Háº§u háº¿t cÃ¡c endpoints yÃªu cáº§u Bearer Token authentication. ThÃªm token vÃ o header:
```
Authorization: Bearer <your_access_token>
```

### Rate Limiting
- Login: 5 requests/60s
- Refresh Token: 5 requests/60s
- Forgot Password: 5 requests/60s
- Reset Password: 1 request/60s

### Pagination
CÃ¡c API há»— trá»£ phÃ¢n trang sá»­ dá»¥ng parameters:
- `page`: Sá»‘ trang (default: 1)
- `limit`: Sá»‘ items per page (default: 10 hoáº·c 20 tÃ¹y endpoint)
- `offset`: Sá»‘ items bá» qua (alternative to page)

### Date Format
Táº¥t cáº£ dates sá»­ dá»¥ng ISO 8601 format:
```
2024-01-01T00:00:00.000Z
```

### Business Rules
1. **FEFO (First Expired, First Out)**: Há»‡ thá»‘ng tá»± Ä‘á»™ng gá»£i Ã½ lÃ´ hÃ ng sáº¯p háº¿t háº¡n trÆ°á»›c khi soáº¡n hÃ ng
2. **Auto Claim Creation**: Khi nháº­n hÃ ng cÃ³ bÃ¡o cÃ¡o thiáº¿u/há»ng, há»‡ thá»‘ng tá»± Ä‘á»™ng táº¡o claim
3. **Inventory Reservation**: Khi Ä‘Æ¡n hÃ ng Ä‘Æ°á»£c approve, sá»‘ lÆ°á»£ng sáº½ Ä‘Æ°á»£c giá»¯ chá»— trong kho
4. **Batch Code Generation**: MÃ£ lÃ´ Ä‘Æ°á»£c tá»± Ä‘á»™ng sinh theo format: `{SKU-PREFIX}-{YEAR}-{SEQUENCE}`
5. **Expiry Date Calculation**: Háº¡n sá»­ dá»¥ng = NgÃ y nháº­p + Shelf Life Days

---

**Generated on**: February 12, 2026  
**API Version**: 1.0.0  
**Base URL**: Configure based on your environment (Dev/Staging/Production)  
**Documentation**: This document covers all available API endpoints in WDP301 Warehouse & Distribution Management System

---

## ðŸ”„ API Workflow Examples

### 1. Táº¡o Ä‘Æ¡n hÃ ng vÃ  nháº­n hÃ ng (End-to-end)
```
1. Franchise Staff: GET /orders/catalog â†’ Xem sáº£n pháº©m
2. Franchise Staff: POST /orders â†’ Táº¡o Ä‘Æ¡n hÃ ng
3. Supply Coordinator: GET /orders/coordinator/:id/review â†’ Review Ä‘Æ¡n
4. Supply Coordinator: PATCH /orders/coordinator/:id/approve â†’ Duyá»‡t Ä‘Æ¡n
5. Kitchen Staff: GET /warehouse/picking-tasks â†’ Xem task soáº¡n hÃ ng
6. Kitchen Staff: GET /warehouse/picking-tasks/:id â†’ Xem chi tiáº¿t + FEFO
7. Kitchen Staff: PATCH /warehouse/shipments/finalize-bulk â†’ Xuáº¥t kho
8. Franchise Staff: GET /shipments/store/my â†’ Xem hÃ ng Ä‘ang Ä‘áº¿n
9. Franchise Staff: POST /shipments/:id/receive â†’ Nháº­n hÃ ng
```

### 2. Nháº­p hÃ ng tá»« nhÃ  cung cáº¥p
```
1. Kitchen Staff: POST /inbound/receipts â†’ Táº¡o phiáº¿u nháº­p
2. Kitchen Staff: POST /inbound/receipts/:id/items â†’ Khai bÃ¡o hÃ ng (láº·p láº¡i cho má»—i sáº£n pháº©m)
3. Kitchen Staff: GET /inbound/batches/:id/label â†’ In tem QR cho tá»«ng lÃ´
4. Kitchen Staff: PATCH /inbound/receipts/:id/complete â†’ Chá»‘t phiáº¿u â†’ Cá»™ng vÃ o kho
```

### 3. Xá»­ lÃ½ khiáº¿u náº¡i
```
1. Franchise Staff: POST /shipments/:id/receive â†’ Nháº­n hÃ ng (cÃ³ bÃ¡o cÃ¡o há»ng/thiáº¿u)
   â†’ System tá»± Ä‘á»™ng táº¡o claim
2. Supply Coordinator: GET /claims â†’ Xem danh sÃ¡ch claim
3. Supply Coordinator: GET /claims/:id â†’ Xem chi tiáº¿t
4. Supply Coordinator: PATCH /claims/:id/resolve â†’ Xá»­ lÃ½ claim
```

---



## 🧩 Backend Matched - Missing APIs Added

### A. System API

#### 1. GET `/`
**Mô tả**: Root endpoint hệ thống  
**Quyền truy cập**: Public  
**Authentication**: Không yêu cầu Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "Hello World!",
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1"
}
```

---

### B. Base Unit Management APIs

#### 1. POST `/base-units`
**Mô tả**: Tạo đơn vị tính mới  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | ✅ | @IsNotEmpty, @IsString | Tên đơn vị tính |
| description | string | ⚪ | @IsOptional, @IsString | Mô tả |

**Response**:
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Kg",
    "description": "Kilogram"
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/base-units"
}
```

---

#### 2. GET `/base-units`
**Mô tả**: Lấy danh sách đơn vị tính  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Kg",
      "description": "Kilogram"
    }
  ],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/base-units"
}
```

---

#### 3. GET `/base-units/:id`
**Mô tả**: Lấy chi tiết đơn vị tính  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Path Parameters**:
- `id` (required): ID đơn vị tính (integer)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Kg",
    "description": "Kilogram"
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/base-units/1"
}
```

---

#### 4. PATCH `/base-units/:id`
**Mô tả**: Cập nhật đơn vị tính  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Path Parameters**:
- `id` (required): ID đơn vị tính (integer)

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | ⚪ | @IsOptional, @IsString | Tên đơn vị tính |
| description | string | ⚪ | @IsOptional, @IsString | Mô tả |

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Kilogram",
    "description": "Updated description"
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/base-units/1"
}
```

---

#### 5. DELETE `/base-units/:id`
**Mô tả**: Xóa đơn vị tính  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Path Parameters**:
- `id` (required): ID đơn vị tính (integer)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "deleted": true,
    "id": 1
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/base-units/1"
}
```

---

### C. Order Analytics APIs

#### 1. GET `/orders/analytics/fulfillment-rate`
**Mô tả**: Báo cáo tỷ lệ đáp ứng đơn hàng (Fill Rate)  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `storeId` (optional): UUID cửa hàng
- `from` (optional): Ngày bắt đầu (ISO date)
- `to` (optional): Ngày kết thúc (ISO date)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "fillRate": 92.5,
    "requestedItems": 1000,
    "fulfilledItems": 925
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/orders/analytics/fulfillment-rate"
}
```

---

#### 2. GET `/orders/analytics/performance/lead-time`
**Mô tả**: Theo dõi thời gian vận hành SLA (review/picking/delivery)  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `from` (optional): Ngày bắt đầu (ISO date)
- `to` (optional): Ngày kết thúc (ISO date)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "avgReviewTimeHours": 1.4,
    "avgPickingTimeHours": 2.1,
    "avgDeliveryTimeHours": 5.3
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/orders/analytics/performance/lead-time"
}
```

---

### D. Claim Analytics API

#### 1. GET `/claims/analytics/summary`
**Mô tả**: Tỷ lệ sai lệch và hư hỏng khi giao hàng  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `productId` (optional): ID sản phẩm (integer)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "damageRate": 3.5,
    "missingRate": 2.1,
    "topProblemProducts": []
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/claims/analytics/summary"
}
```

---

### E. Franchise Store Analytics APIs

#### 1. GET `/stores/analytics/reliability`
**Mô tả**: Đánh giá độ tin cậy cửa hàng và phát hiện bất thường  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/stores/analytics/reliability"
}
```

---

#### 2. GET `/stores/analytics/demand-pattern`
**Mô tả**: Phân tích xu hướng đặt hàng theo thứ trong tuần  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `productId` (optional): ID sản phẩm (integer)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/stores/analytics/demand-pattern"
}
```

---

### F. Inventory Analytics APIs

#### 1. GET `/inventory/analytics/summary`
**Mô tả**: Tổng quan sức khỏe kho bếp  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {},
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/inventory/analytics/summary"
}
```

---

#### 2. GET `/inventory/analytics/aging`
**Mô tả**: Báo cáo tuổi hàng (Aging Report)  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `daysThreshold` (optional): Ngưỡng ngày cảnh báo (integer >= 1)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [],
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/inventory/analytics/aging"
}
```

---

#### 3. GET `/inventory/analytics/waste`
**Mô tả**: Thống kê hao hụt và hủy hàng  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `fromDate` (optional): Ngày bắt đầu (ISO date)
- `toDate` (optional): Ngày kết thúc (ISO date)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "wasteItems": [],
    "totalWaste": 0
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/inventory/analytics/waste"
}
```

---

#### 4. GET `/inventory/analytics/financial/loss-impact`
**Mô tả**: Ước tính thiệt hại tài chính  
**Quyền truy cập**: MANAGER, ADMIN  
**Authentication**: Bearer Token

**Query Parameters**:
- `from` (optional): Ngày bắt đầu (ISO date)
- `to` (optional): Ngày kết thúc (ISO date)

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "estimatedLoss": 0,
    "currency": "VND"
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/inventory/analytics/financial/loss-impact"
}
```

---

### G. Upload API

#### 1. POST `/upload/image`
**Mô tả**: Upload ảnh lên Cloudinary  
**Quyền truy cập**: Public  
**Authentication**: Không yêu cầu Bearer Token  
**Content-Type**: `multipart/form-data`

**Request Body Schema**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| file | binary | ✅ | Max 5MB, only png/jpeg/jpg/webp | File ảnh upload |

**Response**:
```json
{
  "statusCode": 201,
  "message": "Success",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "public_id": "wdp301/abc123"
  },
  "timestamp": "2026-02-22T00:00:00.000Z",
  "path": "/wdp301-api/v1/upload/image"
}
```

---

## ✅ Backend Matched Verification
- Tổng số route backend controller: **85**
- Tổng số route documented trong `API_MATCHED.md`: **85**
- Missing endpoint: **0**
- Extra endpoint: **0**
- Validation error status: **400**
- Base URL chuẩn: **`/wdp301-api/v1`**
