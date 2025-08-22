import { useState, useEffect } from 'react';

export function useHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function fetchHistory() {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch('http://localhost:8000/api/comparison/history/', {
        headers: {
          'X-API-Key': 'my-secret-api-key'
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      const data = await response.json();
      setHistory(data);
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, error, fetchHistory };
}
