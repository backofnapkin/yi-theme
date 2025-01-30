import { useState, useEffect } from 'react';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';

export const useBitcoinPrice = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(COINGECKO_API_URL);
        if (!response.ok) throw new Error('Failed to fetch BTC price');
        const data = await response.json();
        setPrice(data.bitcoin.usd);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price');
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return { price, loading, error };
};