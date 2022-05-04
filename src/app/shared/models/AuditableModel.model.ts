export interface AuditableModelModel {
  createdAt?: number;
  lastModifiedAt?: number;
  createdBy?: string;
  lastModifiedBy?: string;
  deleted?: boolean;
}
