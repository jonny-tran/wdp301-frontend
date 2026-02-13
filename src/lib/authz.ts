
import { User } from "@/types/user";
import { Action, Resource } from "@/utils/constant";

import { Role } from "@/utils/enum";





export type ResourceType = typeof Resource[keyof typeof Resource];
export type ActionType = typeof Action[keyof typeof Action];

// Define Permissions Schema
type Permissions = {
    [key in Role]: {
        [key in ResourceType]?: string[];
    };
};

const PERMISSION: Permissions = {
    [Role.FRANCHISE_STORE_STAFF]: {
        [Resource.ORDER]: [
            `${Action.CREATE}:ingredients`, // Tạo đơn đặt hàng nguyên liệu
            `${Action.TRACK}:status`,       // Theo dõi trạng thái xử lý
            `${Action.CONFIRM}:receipt`,    // Xác nhận đã nhận hàng
            'feedback:quality'              // Phản hồi chất lượng
        ],
        [Resource.INVENTORY]: [
            `${Action.READ}:store_current`  // Xem tồn kho hiện tại tại cửa hàng
        ]
    },
    [Role.CENTRAL_KITCHEN_STAFF]: {
        [Resource.ORDER]: [
            `${Action.READ}:incoming`,      // Tiếp nhận đơn từ cửa hàng
            `${Action.PROCESS}:order`       // Xử lý đơn đặt hàng
        ],
        [Resource.PRODUCTION]: [
            `${Action.PLAN}:demand`,        // Lập kế hoạch sản xuất theo nhu cầu
            `${Action.UPDATE}:status`,      // Cập nhật trạng thái sản xuất
            `${Action.UPDATE}:export_warehouse` // Cập nhật xuất kho
        ],
        [Resource.INVENTORY]: [
            `${Action.MANAGE}:input_material`, // Quản lý nguyên liệu đầu vào
            `${Action.MANAGE}:batch_expiry`    // Quản lý hạn sử dụng và lô
        ]
    },
    [Role.SUPPLY_COORDINATOR]: {
        [Resource.ORDER]: [
            `${Action.AGGREGATE}:all`,      // Tổng hợp và phân loại đơn
        ],
        [Resource.PRODUCTION]: [
            'coordinate:distribution'       // Điều phối sản xuất và phân phối
        ],
        [Resource.DELIVERY]: [
            `${Action.SCHEDULE}:shipping`,  // Lập lịch giao hàng
            `${Action.TRACK}:progress`,     // Theo dõi tiến độ vận chuyển
            'handle:issues'                 // Xử lý vấn đề phát sinh
        ]
    },
    [Role.MANAGER]: {
        [Resource.PRODUCT]: [
            `${Action.MANAGE}:catalog`,     // Quản lý danh mục sản phẩm
            `${Action.MANAGE}:recipe`,      // Quản lý công thức
            `${Action.MANAGE}:norms`        // Quản lý định mức
        ],
        [Resource.INVENTORY]: [
            `${Action.MANAGE}:central`,     // Quản lý tồn kho bếp trung tâm
            `${Action.MANAGE}:store`        // Quản lý tồn kho cửa hàng
        ],
        [Resource.REPORT]: [
            `${Action.TRACK}:performance`,  // Theo dõi hiệu suất
            `${Action.READ}:cost_loss`,     // Báo cáo chi phí, hao hụt
            `${Action.READ}:efficiency`     // Hiệu quả vận hành
        ]
    },
    [Role.ADMIN]: {
        [Resource.USER]: [
            `${Action.MANAGE}:roles`,       // Quản lý người dùng và phân quyền
        ],
        [Resource.SYSTEM]: [
            `${Action.CONFIGURE}:params`,   // Cấu hình tham số vận hành
            `${Action.CONFIGURE}:units`,    // Cấu hình đơn vị tính
            `${Action.CONFIGURE}:process`   // Cấu hình quy trình
        ],
        [Resource.STORE]: [
            `${Action.MANAGE}:list`         // Quản lý danh mục cửa hàng/bếp
        ],
        [Resource.REPORT]: [
            `${Action.READ}:aggregated`     // Báo cáo tổng hợp toàn hệ thống
        ]
    }
};

/**
 * Check if a user has permission to perform an action on a resource
 * @param user The user object containing the role
 * @param resource The resource being accessed
 * @param action The specific action or permission string to check
 * @returns boolean
 */
export const checkPermission = (
    user: User | null | undefined,
    resource: ResourceType,
    actionString: string
): boolean => {
    if (!user || !user.role) return false;

    // Normalize role string to match Enum values if necessary, 
    // or assume user.role matches Role values exactly.
    // Here we cast user.role to Role for lookup.
    const roleKey = Object.values(Role).find(r => r === user.role);

    if (!roleKey) {
        console.warn(`Role definition not found for user role: ${user.role}`);
        return false;
    }

    const rolePermissions = PERMISSION[roleKey as Role];
    if (!rolePermissions) return false;

    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;

    // Check if the specific action string exists in the resource permissions
    // This allows for exact matches or partial matches if logic requires extension
    return resourcePermissions.includes(actionString);
};