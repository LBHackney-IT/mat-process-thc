import isOnline from "is-online";
import { useState } from "react";
import { useAsync } from "react-async-hook";

export interface UseOnlineReturn {
  loading: boolean;
  result?: boolean;
  error?: Error;

  retry(): void;
}

const useOnline = (): UseOnlineReturn => {
  const [retryCount, setRetryCount] = useState(0);
  const online = useAsync(async () => isOnline(), [retryCount]);

  return {
    loading: online.loading,
    result: online.result,
    error: online.error,

    retry(): void {
      setRetryCount((count) => count + 1);
    },
  };
};

export default useOnline;
