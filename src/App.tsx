import React, { useState } from 'react';

const App: React.FC = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = import.meta.env.VITE_API_URL;
  
  const fetchStockData = async (symbol: string) => {
    setLoading(true);
    const apiUrl = `${API_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Price Peek</h1>

      <input type="text" id="stock-symbol" placeholder="Enter Stock Symbol" value={search} onChange={e => setSearch(e.target.value)}  />
      <button onClick={() => fetchStockData(search)} disabled={loading} id="fetch-price">Get Price</button>
      {
        stockData
        ?
          <div className="stock-data">
            <h2>{stockData['Meta Data']['2. Symbol']}</h2>
            <p>{stockData['Meta Data']['3. Last Refreshed']}</p>
            <p>{stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['1. open']}</p>
            <p>{stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['2. high']}</p>
            <p>{stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['3. low']}</p>
            <p>{stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['4. close']}</p>
            <p>{stockData['Time Series (5min)'][Object.keys(stockData['Time Series (5min)'])[0]]['5. volume']}</p>
          </div>
        :
        null
      }
    </div>
  );
};

export default App;
