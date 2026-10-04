import { useState, useEffect } from "react";

/**
 * Debounce a rapidly changing value by `delay` milliseconds.
 * Useful for slider inputs, search filters, and real-time form inputs
 * to prevent hammering API endpoints or firing heavy computations.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
