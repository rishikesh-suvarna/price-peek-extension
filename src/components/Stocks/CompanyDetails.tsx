
interface CompanyData {
    Name: string;
    Symbol: string;
    Description: string;
    Industry: string;
    Exchange: string;
    Country: string;
    MarketCapitalization: string;
    DividendYield: string;
    DividendPerShare: string;
    '52WeekHigh': string;
    '52WeekLow': string;
    '50DayMovingAverage': string;
    '200DayMovingAverage': string;
}

interface CompanyDetailsProps {
    data: CompanyData;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
    data
}) => {
  return (
    <div className="company-details mt-4">
        <h2>{data.Name} ({data.Symbol})</h2>
        <p className="description">{data.Description}</p>
        <p>Industry: {data.Industry}</p>
        <p>Exchange: {data.Exchange}</p>
        <p>Country: {data.Country}</p>
        <p>Market Cap: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data.MarketCapitalization))}</p>
        <p>Dividend Yeild: {data.DividendYield}</p>
        <p>Dividend Per Share: {data.DividendPerShare}</p>
        <hr className="my-2" />
        <p>52 Week High: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data['52WeekHigh']))}</p>
        <p>52 Week Low: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data['52WeekLow']))}</p>
        <p>50 Day Moving Average: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data['50DayMovingAverage']))}</p>
        <p>200 Day Moving Average: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data['200DayMovingAverage']))}</p>
    </div>
  )
}

export default CompanyDetails