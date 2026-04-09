import { useMemo } from "react";
import {
  createInitialAmount,
  editInitialAmount,
  getInitialAmountsErrorMessage,
  subscribeToInitialAmounts,
} from "../services/initialAmounts";
import { useRealtimeCollection } from "./useRealtimeCollection";

export function useInitialAmounts({
  userId,
  filter,
  customStartDate,
  customEndDate,
}) {
  const queryOptions = useMemo(
    () => ({
      userId,
      filter,
      customStartDate,
      customEndDate,
    }),
    [customEndDate, customStartDate, filter, userId],
  );
  const { items: initialAmounts, loading, error } = useRealtimeCollection({
    userId,
    subscribe: subscribeToInitialAmounts,
    getErrorMessage: getInitialAmountsErrorMessage,
    queryOptions,
  });

  return {
    initialAmounts,
    loading,
    error,
    createInitialAmount,
    editInitialAmount,
  };
}
