// Define Actions
export const Action = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    CONFIRM: 'confirm',
    PLAN: 'plan',
    PROCESS: 'process',
    MANAGE: 'manage',
    SCHEDULE: 'schedule',
    TRACK: 'track',
    AGGREGATE: 'aggregate',
    CONFIGURE: 'configure',
} as const;

// Define Resources
export const Resource = {
    ORDER: 'order',
    INVENTORY: 'inventory',
    PRODUCTION: 'production',
    DELIVERY: 'delivery',
    PRODUCT: 'product',
    USER: 'user',
    SYSTEM: 'system',
    REPORT: 'report',
    STORE: 'store',
} as const;


// export const QUERY_KEY = {
//     examType: (param?: ExamTypeQuery) => ['examType', param],
//     examTypeById: (id: number) => ['examTypeById', id],



// } as const
export const KEY = {
    me: ['profile']
} as const;