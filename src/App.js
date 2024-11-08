import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState(1);
  // const [currentValue, setCurrentValue] = useState(0);
  const [fromCurrency, setFromCurrency] = useState("USD"); // Default from USD
  const [toCurrency, setToCurrency] = useState("EUR"); // Default to EUR
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch exchange rate");
        }
        const data = await res.json();
        // console.log("API Response:", data); // Debugging
        if (data.rates && data.rates[toCurrency]) {
          setExchangeRate(data.rates[toCurrency]);
        } else {
          throw new Error(`Exchange rate for ${toCurrency} not found`);
        }
      } catch (error) {
        console.error(error);
        setExchangeRate(null);
        setConvertedAmount(null);
      }
    };
    fetchExchangeRate();
  }, [convertedAmount, fromCurrency, toCurrency, amount]);

  // Calculate converted amount when exchangeRate or amount changes
  useEffect(() => {
    if (exchangeRate) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
      console.log(convertedAmount);
    }
  }, [exchangeRate, amount, convertedAmount]);

  return (
    <div className="app">
      <div>
        <h1>Currency Converter</h1>
      </div>
      <input
        type="text"
        onChange={(e) => setAmount(Number(e.target.value))}
        value={amount}
      />
      <select
        onChange={(e) => setFromCurrency(e.target.value)}
        value={fromCurrency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        onChange={(e) => setToCurrency(e.target.value)}
        value={toCurrency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>
        {convertedAmount !== null
          ? `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`
          : "Loading..."}
      </p>
    </div>
  );
}

export default App;
