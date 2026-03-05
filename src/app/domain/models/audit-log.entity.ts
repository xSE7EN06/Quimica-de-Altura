export interface AuditLog {
    id: string;
    userName: string;
    action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
    resource: string;
    resourceId: string;
    changes?: string;
    timestamp: string;
    ipAddress?: string;
}
