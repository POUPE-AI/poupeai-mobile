import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ingestionJobsService } from "@/services/ingestionJobs";
import { ImportBankStatementRequest } from "@/types/ingestionJobs";
import {
  ingestionJobsKeys,
  transactionsKeys,
  dashboardKeys,
  bankAccountsKeys,
} from "@/constants/queryKeys";

export function useIngestionJobs() {
  return useQuery({
    queryKey: ingestionJobsKeys.list(),
    queryFn: () => ingestionJobsService.getIngestionJobs(),
  });
}

export function useImportBankStatement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ImportBankStatementRequest) =>
      ingestionJobsService.importBankStatement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ingestionJobsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      queryClient.invalidateQueries({ queryKey: bankAccountsKeys.all });
    },
  });
}
