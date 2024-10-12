const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://www.alphavantage.co/query';


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fetch-price')?.addEventListener('click', fetchStockPrice);
});

const fetchStockPrice = async () => {
    try {

        const symbolInput = document.getElementById('stock-symbol') as HTMLInputElement | null;
        const resultDiv = document.getElementById('result');
        
        if (!symbolInput || !symbolInput.value) {
            if (resultDiv) {
                resultDiv.innerHTML = 'Please enter a stock symbol.';
            }
            return;
        }

        const symbol = symbolInput.value.toUpperCase();

        const response = await fetch(`${API_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${API_KEY}`);
        const data: { 'Time Series (5min)': { [key: string]: { '1. open': string } } } = await response.json();
        console.info(data)
        const timeSeries = data['Time Series (5min)'];
        if (!timeSeries) {
            if (resultDiv) {
                resultDiv.innerHTML = 'Invalid stock symbol or data not available.';
            }
            return;
        }
        
        const latestTime = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestTime];
        const price = latestData['1. open'];

        if (resultDiv) {
            resultDiv.innerHTML = `
                <h2>${symbol}</h2>
                <p>Latest Price: $${price}</p>
                <p>Time: ${latestTime}</p>
            `;
        }

    } catch (error) {
        console.error(error)
    } 
};