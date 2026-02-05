export type IngestionJobStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export interface IngestionJob {
  id: string;
  status: IngestionJobStatus;
  fileKeyMinio: string;
  destinationEntityId: string;
  createdAt: string;
}

export interface ImportBankStatementRequest {
  bankAccountId: string;
  fallbackIncomeCategoryId: string;
  fallbackExpenseCategoryId: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
}
