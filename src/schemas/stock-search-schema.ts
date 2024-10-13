import * as Yup from "yup";


export const StockSearchFormSchema = Yup.object().shape({
    stock_symbol: Yup.string().required("Stock symbol is required"),
});

export type StockSearchFormValyes = Yup.InferType<typeof StockSearchFormSchema>;