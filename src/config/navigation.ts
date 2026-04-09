import {
    ChartBarIcon,
    UserGroupIcon,
    TruckIcon,
    ClipboardDocumentCheckIcon,
    AdjustmentsHorizontalIcon,
    CubeIcon,
    InboxStackIcon,
    ClipboardDocumentListIcon,
    ArchiveBoxIcon,
    BuildingStorefrontIcon,
    HomeIcon,
    InboxArrowDownIcon,
    ExclamationTriangleIcon,
    BeakerIcon,
    QueueListIcon,
    BuildingOffice2Icon,
    GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { Role } from "@/utils/enum";
import { Resource } from "@/utils/constant";
import { NavItem } from "@/components/layout/NavSidebar";
import { P, PermissionType } from "@/lib/authz";

export interface ProtectedNavItem extends NavItem {
    requiredPermission?: {
        resource: string;
        action: PermissionType;
    };
}

export const ROLE_NAVIGATION: Record<string, ProtectedNavItem[]> = {
    [Role.ADMIN]: [
        { name: "Tổng quan", href: "/admin/dashboard", icon: HomeIcon },
        {
            name: "Người dùng",
            href: "/admin/auth",
            icon: UserGroupIcon,
            requiredPermission: { resource: Resource.USER, action: P.USER_READ_LIST }
        },
        {
            name: "Vận chuyển",
            href: "/admin/shipment",
            icon: TruckIcon,
            requiredPermission: { resource: Resource.STORE, action: P.STORE_READ_LIST }
        },
        {
            name: "Hậu Cần",
            href: "/manager/logistics",
            icon: GlobeAltIcon, 
        },
        {
            name: "Khiếu nại",
            href: "/admin/claim",
            icon: ClipboardDocumentCheckIcon,
            requiredPermission: { resource: Resource.REPORT, action: P.REPORT_AGGREGATED }
        },
        {
            name: "Cấu hình",
            href: "/admin/config",
            icon: AdjustmentsHorizontalIcon,
            requiredPermission: { resource: Resource.SYSTEM, action: P.SYSTEM_CONFIGURE_PARAMS }
        },
    ],
    [Role.MANAGER]: [
        { name: "Tổng quan", href: "/manager/dashboard", icon: HomeIcon },
        {
            name: "Sản phẩm",
            href: "/manager/products",
            icon: CubeIcon,
            requiredPermission: { resource: Resource.PRODUCT, action: P.PRODUCT_READ_LIST }
        },
        {
            name: "Công thức",
            href: "/manager/production/recipes",
            icon: BeakerIcon,
            requiredPermission: { resource: Resource.PRODUCT, action: P.PRODUCT_READ_LIST }
        },
        {
            name: "Sản xuất",
            href: "/manager/production/orders",
            icon: QueueListIcon,
            requiredPermission: { resource: Resource.PRODUCT, action: P.PRODUCT_READ_LIST }
        },
        {
            name: "Lô Hàng",
            href: "/manager/batch",
            icon: InboxStackIcon,
            requiredPermission: { resource: Resource.INVENTORY, action: P.INVENTORY_READ_KITCHEN_DETAILS }
        },
        {
            name: "Hàng tồn kho",
            href: "/manager/inventory",
            icon: InboxStackIcon,
            requiredPermission: { resource: Resource.INVENTORY, action: P.INVENTORY_READ_KITCHEN_SUMMARY }
        },
        {
            name: "Đơn hàng",
            href: "/manager/order",
            icon: ClipboardDocumentListIcon,
            requiredPermission: { resource: Resource.REPORT, action: P.REPORT_FULFILLMENT_RATE }
        },
        {
            name: "Vận chuyển",
            href: "/manager/shipment",
            icon: TruckIcon,
            requiredPermission: { resource: Resource.REPORT, action: P.REPORT_LEAD_TIME }
        },
        {
            name: "Hậu Cần",
            href: "/manager/logistics",
            icon: GlobeAltIcon, 
        },
        {
            name: "Nhà cung cấp",
            href: "/manager/supplier",
            icon: BuildingOffice2Icon,
        },
        {
            name: "Đơn vị tính",
            href: "/manager/baseUnits",
            icon: ArchiveBoxIcon,
            requiredPermission: { resource: Resource.PRODUCT, action: P.PRODUCT_READ_CATEGORIES }
        },
        {
            name: "Khiếu nại",
            href: "/manager/claim",
            icon: ClipboardDocumentCheckIcon,
        },
        {
            name: "Cửa hàng",
            href: "/manager/store",
            icon: BuildingStorefrontIcon,
            requiredPermission: { resource: Resource.INVENTORY, action: P.INVENTORY_READ_STORE_STOCK }
        },
    ],
    [Role.CENTRAL_KITCHEN_STAFF]: [
        { name: "Tổng quan", href: "/kitchen/dashboard", icon: HomeIcon },
        {
            name: "Tồn kho",
            href: "/kitchen/inventory",
            icon: CubeIcon,
            requiredPermission: { resource: Resource.INVENTORY, action: P.INVENTORY_READ_KITCHEN_SUMMARY }
        },
        {
            name: "Sản xuất",
            href: "/kitchen/production",
            icon: BeakerIcon,
            requiredPermission: { resource: Resource.INVENTORY, action: P.INVENTORY_READ_KITCHEN_SUMMARY }
        },
        {
            name: "Nhập hàng",
            href: "/kitchen/inbound",
            icon: InboxArrowDownIcon,
            requiredPermission: { resource: Resource.INBOUND, action: P.INBOUND_CREATE_RECEIPT }
        },
        {
            name: "Lô hàng",
            href: "/kitchen/batches",
            icon: CubeIcon,
            requiredPermission: { resource: Resource.INBOUND, action: P.INBOUND_READ_BATCH_LABEL }
        },
        {
            name: "Kho hàng",
            href: "/kitchen/warehouse",
            icon: ArchiveBoxIcon,
            requiredPermission: { resource: Resource.WAREHOUSE, action: P.WAREHOUSE_READ_TASKS }
        },
    ],
    [Role.SUPPLY_COORDINATOR]: [
        { name: "Tổng quan", href: "/supply", icon: HomeIcon },
        {
            name: "Điều phối",
            href: "/supply/coordination",
            icon: ChartBarIcon,
            requiredPermission: { resource: Resource.ORDER, action: P.ORDER_APPROVE },
        },
        {
            name: "Đơn hàng",
            href: "/supply/orders",
            icon: ClipboardDocumentListIcon,
            requiredPermission: { resource: Resource.ORDER, action: P.ORDER_READ_ALL_PENDING }
        },
        // {
        //     name: "Phân bổ",
        //     href: "/supply/allocation",
        //     icon: Squares2X2Icon,
        //     requiredPermission: { resource: Resource.ORDER, action: P.ORDER_APPROVE }
        // },
        {
            name: "Giao hàng",
            href: "/supply/delivery",
            icon: TruckIcon,
            requiredPermission: { resource: Resource.DELIVERY, action: P.DELIVERY_SCHEDULE }
        },
        {
            name: "Khiếu nại",
            href: "/supply/issues",
            icon: ExclamationTriangleIcon,
            requiredPermission: { resource: Resource.CLAIM, action: P.CLAIM_READ_ALL }
        },
    ],
};
