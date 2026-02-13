
export enum HttpErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Role {
    ADMIN = 'admin',
    MANAGER = 'manager',
    SUPPLY_COORDINATOR = 'supply_coordinator',
    CENTRAL_KITCHEN_STAFF = 'central_kitchen_staff',
    FRANCHISE_STORE_STAFF = 'franchise_store_staff'
}

export enum OrderStatus {
    PENDING = 'pending',         // Chờ duyệt
    APPROVED = 'approved',       // Đã duyệt
    REJECTED = 'rejected',       // Từ chối
    CANCELLED = 'cancelled',     // Đã hủy
    PICKING = 'picking',         // Đang soạn hàng
    DELIVERING = 'delivering',   // Đang giao hàng
    COMPLETED = 'completed',     // Hoàn thành
    CLAIMED = 'claimed'          // Có khiếu nại
}


export enum ShipmentStatus {
    PREPARING = 'preparing',     // Đang chuẩn bị
    IN_TRANSIT = 'in_transit',   // Đang vận chuyển
    DELIVERED = 'delivered',     // Đã giao hàng
    COMPLETED = 'completed',     // Hoàn thành
    CANCELLED = 'cancelled'      // Đã hủy
}

export enum ClaimStatus {
    PENDING = 'pending',         // Chờ xử lý
    APPROVED = 'approved',       // Đã chấp nhận
    REJECTED = 'rejected'        // Từ chối
}

export enum TransactionType {
    IMPORT = 'import',           // Nhập kho
    EXPORT = 'export',           // Xuất kho
    WASTE = 'waste',             // Hao hụt
    ADJUSTMENT = 'adjustment'    // Điều chỉnh
}
export enum ReceiptStatus {
    DRAFT = 'draft',             // Nháp (đang soạn)
    COMPLETED = 'completed',     // Đã hoàn tất
    CANCELLED = 'cancelled'      // Đã hủy
}

export enum BatchStatus {
    PENDING = 'pending',         // Chờ xử lý
    AVAILABLE = 'available',     // Sẵn sàng
    EMPTY = 'empty',             // Hết hàng
    EXPIRED = 'expired'          // Hết hạn
}

export enum WarehouseType {
    CENTRAL = 'central',                // Kho trung tâm
    STORE_INTERNAL = 'store_internal'   // Kho cửa hàng
}

export enum UserStatus {
    ACTIVE = 'active',           // Đang hoạt động
    BANNED = 'banned'            // Bị khóa
}
