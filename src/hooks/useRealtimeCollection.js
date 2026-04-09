import { useEffect, useState } from "react";

export function useRealtimeCollection({
  userId,
  subscribe,
  getErrorMessage,
  queryOptions,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError("");

    const unsubscribe = subscribe(
      queryOptions,
      (data) => {
        setItems(data);
        setLoading(false);
      },
      (loadError) => {
        setError(getErrorMessage(loadError));
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [getErrorMessage, queryOptions, subscribe, userId]);

  return {
    items,
    loading,
    error,
  };
}
