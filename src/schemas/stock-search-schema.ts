import * as Yup from "yup";


export const StockSearchFormSchema = Yup.object().shape({
    stock_symbol: Yup.object().shape({
        value: Yup.string().required("Stock symbol is required"),
        label: Yup.string().required("Stock symbol is required"),
    }),
});

export type StockSearchFormValues = Yup.InferType<typeof StockSearchFormSchema>;