import { useState, useEffect, useCallback } from 'react';

interface UseFetchReturn<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

function useFetch<T>(url: string): UseFetchReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            console.log(`🔄 Fetching from: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: T = await response.json();
            console.log(`✅ Data fetched successfully:`, result);

            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`❌ Fetch error:`, errorMessage);
            setError(errorMessage);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (url) {
            fetchData();
        }
    }, [url, fetchData]);

    return { data, loading, error, refetch: fetchData };
}

export default useFetch;