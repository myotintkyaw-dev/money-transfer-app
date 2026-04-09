import { useMemo } from "react";
import {
  getUseLogsErrorMessage,
  subscribeToUseLogs,
} from "../services/useLogs";
import { useRealtimeCollection } from "./useRealtimeCollection";

export function useUseLogs({ userId, filter, customStartDate, customEndDate }) {
  const queryOptions = useMemo(
    () => ({
      userId,
      filter,
      customStartDate,
      customEndDate,
    }),
    [customEndDate, customStartDate, filter, userId],
  );
  const { items: useLogs, loading, error } = useRealtimeCollection({
    userId,
    subscribe: subscribeToUseLogs,
    getErrorMessage: getUseLogsErrorMessage,
    queryOptions,
  });

  return {
    useLogs,
    loading,
    error,
  };
}
