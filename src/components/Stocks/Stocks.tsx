import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StockSearchFormSchema, StockSearchFormValues } from "../../schemas/stock-search-schema";
import { useCallback, useEffect, useState } from "react";
import { searchStockData, useFetchStockData } from "../../apis/api";
import Spinner from "../Common/Spinner";
import CompanyDetails from "./CompanyDetails";
import Async from "react-select/async";
import debounce from "../../utils/debounce";
import { getFavoriteStocks, saveFavoriteStocks } from "../../utils/chome-storage";


const Stocks = () => {
    const [symbol, setSymbol] = useState<string | null>(null);
    const { data, isLoading, error } = useFetchStockData("OVERVIEW", symbol);

    const { control, handleSubmit, formState: { errors } } = useForm<StockSearchFormValues>({
        resolver: yupResolver(StockSearchFormSchema),
    });

    const onSubmit = (data: StockSearchFormValues) => {
        console.log(data)
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
        []
    )

    const addToFavourites = () => {
        if(data) {
            console.log(data.data)
            saveFavoriteStocks("favoriteStocks", [data.data.symbol]);
        } else {
            console.error("No data to save to favourites");
        }
    }

    useEffect(() => {
        const stocks = getFavoriteStocks("favoriteStocks");
        console.info(stocks)
    }, [])
   
    
    return (
        <div className="stocks-wrapper">
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
            <button onClick={addToFavourites} className="w-full btn mt-2">Add To Favourites</button>

            {
                isLoading && <Spinner classnames="mt-4" />
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