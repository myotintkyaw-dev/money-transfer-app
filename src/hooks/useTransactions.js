import { useMemo } from "react";
import {
  createTransaction,
  editTransaction,
  getTransactionErrorMessage,
  removeTransaction,
  subscribeToTransactions,
} from "../services/transactions";
import { useRealtimeCollection } from "./useRealtimeCollection";

export function useTransactions({ userId, filter, customStartDate, customEndDate }) {
  const queryOptions = useMemo(
    () => ({
      userId,
      filter,
      customStartDate,
      customEndDate,
    }),
    [customEndDate, customStartDate, filter, userId],
  );
  const { items: transactions, loading, error } = useRealtimeCollection({
    userId,
    subscribe: subscribeToTransactions,
    getErrorMessage: getTransactionErrorMessage,
    queryOptions,
  });

  return {
    transactions,
    loading,
    error,
    createTransaction,
    editTransaction,
    removeTransaction,
  };
}
