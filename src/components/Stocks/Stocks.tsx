import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StockSearchFormSchema, StockSearchFormValues } from "../../schemas/stock-search-schema";
import { useCallback, useEffect, useState } from "react";
import { searchStockData, useFetchStockData, useFetchTimeSeries } from "../../apis/api";
import Spinner from "../Common/Spinner";
import CompanyDetails from "./CompanyDetails";
import Async from "react-select/async";
import debounce from "../../utils/debounce";
import { storage } from "../../utils/storage";
import { toast } from "sonner";
import LineChart from "../Common/LineChart";

const DEFAULT_FAVOURITES: string[] = [
    "AAPL",
    "GOOGL",
    "MSFT",
    "AMZN",
    "TSLA",
    "FB",
    "NVDA",
    "PYPL",
    "INTC",
    "AMD",
    "NFLX",
    "ADBE",
    "CSCO",
    "CMCSA",
    "PEP",
];

const Stocks = () => {
    const [symbol, setSymbol] = useState<string | null>(null);
    const { data, isLoading, error } = useFetchStockData("OVERVIEW", symbol);
    const { data: timeSeriesData } = useFetchTimeSeries("TIME_SERIES_DAILY", symbol);
    const [favourites, setFavourites] = useState<string[]>(DEFAULT_FAVOURITES);
    const [chartData, setChartData] = useState<{ labels: string[], dataPoints: number[] }>({ labels: [], dataPoints: [] });

    const { control, handleSubmit, formState: { errors } } = useForm<StockSearchFormValues>({
        resolver: yupResolver(StockSearchFormSchema),
    });

    const onSubmit = (data: StockSearchFormValues) => {
        setSymbol(data.stock_symbol.value);
    }

    const loadOptions = useCallback(
        debounce(async (inputText: string, callback: (results: never[]) => void) => {
            if (!inputText || inputText.length < 2) {
                return callback([]);
            }
            const res = await searchStockData(inputText);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const results = res.data.bestMatches.map((match: any) => ({
                value: match["1. symbol"],
                label: `${match["1. symbol"]} - ${match["2. name"]}`,
            }));
            callback(results);
        }, 1000),
        [debounce]
    )

    const addToFavourites = (symbol: string) => {
        try {
            if (symbol) {
                const favouritesMap = new Set(favourites);
                if (favouritesMap.has(symbol)) {
                    toast.error("Stock already in favourites");
                    return;
                }
                storage.set({ favouriteStocks: [...favourites, symbol] });
                toast.success("Stock added to favourites");
            } else {
                console.error("No data to save to favourites");
                toast.error("An error occurred while saving to favourites");
            }
        } catch (error) {
            console.error("An error occurred while saving to favourites", error);
            toast.error("An error occurred while saving to favourites");
        }
    }

    const fetchFavoriteStocks = async () => {
        const stocks = await storage.get(['favouriteStocks']);
        setFavourites(stocks.favouriteStocks || DEFAULT_FAVOURITES);
        toast.success("Favourites fetched");
    };

    useEffect(() => {
        fetchFavoriteStocks();
    }, [])

    useEffect(() => {
        if (timeSeriesData) {
            let processedData = timeSeriesData?.data["Time Series (Daily)"];
            if (!processedData) {
                return;
            }
            processedData = Object.entries(processedData).slice(0, 10).reverse();
            processedData = Object.fromEntries(processedData);
            const labels = Object.keys(processedData);
            const dataPoints = labels.map((date) => parseFloat(processedData[date]["4. close"]));
            setChartData({ labels, dataPoints });
        }
    }, [timeSeriesData])


    return (
        <div className="stocks-wrapper">
            <div className="favourites-wrapper mb-4">
                <h2 className="text-lg font-bold mb-2">Favourites</h2>
                {
                    favourites.length > 0 ? (
                        <ul className="flex overflow-scroll items-center gap-1 pills-wrapper">
                            {favourites.map((stock, index) => (
                                <li key={index} className="item-pills">
                                    <button className="flex items-center gap-2" onClick={() => setSymbol(stock)}>
                                        {stock}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No favourites found</p>
                    )
                }
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="stock_symbol"
                    render={({ field: { onChange, value } }) => (
                        <Async
                            cacheOptions
                            className={errors.stock_symbol ? "input-error" : ""}
                            classNamePrefix="react-select"
                            loadOptions={loadOptions}
                            onChange={(newValue) => onChange(newValue || null)}
                            value={value ? value : null}
                            placeholder="Search for a stock symbol..."
                            isClearable={true}
                        />
                    )}
                />
                {errors.stock_symbol && <div className="text-red-500 mt-2 text-[10px] uppercase font-bold">Please select a stock symbol</div>}
                <button disabled={isLoading} className="w-full btn mt-2">Search</button>
            </form>
            {
                data &&
                (
                    <button onClick={() => addToFavourites(data.data[`Symbol`])} className="w-full btn mt-2">Add To Favourites</button>
                )
            }
            {
                isLoading && <Spinner classnames="mt-4" />
            }
            {
                chartData.labels.length > 0 && (
                    <div className="">
                        <LineChart
                            labels={chartData.labels}
                            dataPoints={chartData.dataPoints}
                            labelTitle="Close Prices"
                            chartTitle="Close Price Chart"
                            xTitle="Date"
                            yTitle="Price (USD)"
                        />
                    </div>
                )
            }

            {
                error && <div className="text-red-500 mt-2">An error occurred. Please try again later.</div>
            }

            {
                data && <CompanyDetails data={data.data} />
            }

        </div>
    )
}

export default Stocks