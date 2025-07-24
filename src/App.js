import { useEffect, useState } from "react";
import Axios from "axios";
import Select from "react-select";
import { HiSwitchHorizontal } from "react-icons/hi";
import "./App.css";

const API_KEY = "caa49c50187828f02637b47e"; // Replace with your actual API key

function App() {
  const [conversionRates, setConversionRates] = useState({});
  const [input, setInput] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [options, setOptions] = useState([]);
  const [output, setOutput] = useState(0);

  // Fetch exchange rates based on 'from' currency
  useEffect(() => {
    if (!from) return;

    Axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`)
      .then((res) => {
        if (res.data.result === "success") {
          const rates = res.data.conversion_rates;
          setConversionRates(rates);

          // Prepare options array for react-select
          const opts = Object.keys(rates).map((code) => ({
            value: code,
            label: code.toUpperCase(),
          }));
          setOptions(opts);

          // Reset 'to' if not available in new rates
          if (!rates[to]) {
            setTo(opts[0].value);
          }
        } else {
          alert("Failed to fetch rates");
        }
      })
      .catch(() => alert("Error fetching exchange rates"));
  }, [from]);

  // Recalculate converted amount on input, 'to' or rates change
  useEffect(() => {
    if (conversionRates && conversionRates[to]) {
      setOutput(input * conversionRates[to]);
    } else {
      setOutput(0);
    }
  }, [input, to, conversionRates]);

  // Swap 'from' and 'to'
  function flip() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="App">
      <h1>Currency Converter</h1>

      <div className="container">
        <div className="left">
          <h3>Amount</h3>
          <input
            type="number"
            value={input}
            min="0"
            onChange={(e) => setInput(Number(e.target.value))}
            placeholder="Enter amount"
          />
        </div>

        <div className="middle">
          <h3>From</h3>
          <Select
            options={options}
            onChange={(selected) => setFrom(selected.value)}
            value={{ value: from, label: from.toUpperCase() }}
            placeholder="From"
          />
        </div>

        <div className="switch">
          <HiSwitchHorizontal size={30} onClick={flip} />
        </div>

        <div className="right">
          <h3>To</h3>
          <Select
            options={options}
            onChange={(selected) => setTo(selected.value)}
            value={{ value: to, label: to.toUpperCase() }}
            placeholder="To"
          />
        </div>
      </div>

      <div className="result">
        <h2>Converted Amount:</h2>
        <p>
          {input} {from.toUpperCase()} = {output.toFixed(2)} {to.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default App;
