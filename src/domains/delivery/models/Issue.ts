export interface Issue {
    id: string;
    orderId?: string;
    shipmentId?: string;
    type: 'missing-goods' | 'damaged-goods' | 'delayed' | 'other';
    description: string;
    status: 'open' | 'investigating' | 'resolved';
    reportedDate: Date;
}
