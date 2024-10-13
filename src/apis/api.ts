import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

export function useFetchStockData(fn: string, symbol: string | null, interval?: string) {

    const searchParams = new URLSearchParams();
    searchParams.append("function", fn);
    searchParams.append("symbol", symbol!);
    searchParams.append("apikey", API_KEY!);

    return useQuery({
        queryKey: ["fetch-stock-data", fn, symbol, interval],
        queryFn: () => axios.get(`${API_URL}?${searchParams.toString()}`),
        enabled: !!symbol,
    });
}