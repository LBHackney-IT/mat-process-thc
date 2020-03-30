import useOnline from "./useOnline";

export interface UseOnlineWithRetryReturn {
  loading: boolean;
  result?: boolean;
  error?: Error;

  retry(): void;
}

const useOnlineWithRetry = (retryDelay = 3000): UseOnlineWithRetryReturn => {
  const online = useOnline();

  if (online.error) {
    // We should dedupe this error.
    console.error(online.error);
  }

  if (!online.loading && (!online.result || online.error)) {
    // We probably want to give up at some point.
    setTimeout(() => {
      online.retry();
    }, retryDelay);
  }

  return {
    loading: online.result === undefined,
    result: online.result,
    error: online.error,

    retry(): void {
      online.retry();
    },
  };
};

export default useOnlineWithRetry;
