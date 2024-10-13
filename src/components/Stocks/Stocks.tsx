import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StockSearchFormSchema, StockSearchFormValyes } from "../../schemas/stock-search-schema";
import { useCallback, useState } from "react";
import { useFetchStockData } from "../../apis/api";
import Spinner from "../Common/Spinner";
import CompanyDetails from "./CompanyDetails";
import Async from "react-select/async";
import debounce from "../../utils/debounce";


const Stocks = () => {
    const [symbol, setSymbol] = useState<string | null>(null);
    const { control, handleSubmit, formState: { errors } } = useForm<StockSearchFormValyes>({
        resolver: yupResolver(StockSearchFormSchema),
    });

    const { data, isLoading, error } = useFetchStockData("OVERVIEW", symbol);

    const onSubmit = (data: StockSearchFormValyes) => {
        setSymbol(data.stock_symbol);
    }

    const loadOptions = useCallback(
        debounce((inputText, callback) => {
            if (!inputText || inputText.length < 2) {
                return callback([]);
            }
            fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputText}&apikey=${import.meta.env.VITE_API_KEY}`)
                .then((res) => res.json())
                .then((data) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const results = data.bestMatches.map((match: any) => ({
                        value: match["1. symbol"],
                        label: `${match["1. symbol"]} - ${match["2. name"]}`,
                    }));
                    callback(results);
                });
        }, 2000),
        []
    );

    return (
        <div className="stocks-wrapper">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* <input
                    {...register("stock_symbol")}
                    type="text"
                    placeholder="Enter stock symbol"
                    className={errors.stock_symbol ? "input-error" : ""}
                /> */}
                <Controller
                    control={control}
                    name="stock_symbol"
                    render={({ field }) => (
                        <Async
                            {...field}
                            cacheOptions
                            className={errors.stock_symbol ? "input-error" : ""}
                            classNamePrefix="react-select"
                            loadOptions={loadOptions}
                        />
                    )}
                />
                <button disabled={isLoading} className="w-full btn mt-2">Search</button>
            </form>

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