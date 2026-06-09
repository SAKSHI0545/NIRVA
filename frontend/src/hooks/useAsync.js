import { useCallback, useEffect, useState } from 'react';

export function useAsync(callback, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const execute = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await callback();
      setData(result);
      return result;
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, setData, loading, error, refetch: execute };
}
