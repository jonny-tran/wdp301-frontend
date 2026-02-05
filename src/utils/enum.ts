// Define Roles based on the requirements
export enum Role {
    FRANCHISE_STORE_STAFF = 'Franchise Store Staff',
    CENTRAL_KITCHEN_STAFF = 'Central Kitchen Staff',
    SUPPLY_COORDINATOR = 'Supply Coordinator',
    MANAGER = 'Manager',
    ADMIN = 'Admin'
}
export enum HttpErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}