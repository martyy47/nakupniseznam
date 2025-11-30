import { useState, useCallback } from "react";

export function useApiRequest(asyncFn) {
  const [status, setStatus] = useState("pending"); // "pending" | "ready" | "error"
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus("pending");
      setError(null);
      try {
        const result = await asyncFn(...args);
        setData(result);
        setStatus("ready");
        return result;
      } catch (e) {
        setError(e);
        setStatus("error");
        throw e;
      }
    },
    [asyncFn]
  );

  return { status, data, error, execute, setData };
}