
// React Frontend: Search, Visualization, and Hypothesis Suggestions
<-- App.jsx content from canvas (shortened here for clarity) -->
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  
import React, { useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [xAxis, setXAxis] = useState("Mixing Temperature");
  const [yAxis, setYAxis] = useState("Viscosity");
  const [suggestions, setSuggestions] = useState([]);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("${BACKEND_URL}/filter", { query });
      setResults(res.data.matches);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScatterData = () => {
    return results.map((exp) => ({
      x: exp.inputs[xAxis] ?? exp.outputs[xAxis],
      y: exp.inputs[yAxis] ?? exp.outputs[yAxis],
      name: exp.name,
    })).filter((d) => d.x !== undefined && d.y !== undefined);
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("${BACKEND_URL}/suggest");
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Error getting suggestions:", err);
    }
  };

  const allFields = [
    ...new Set(
      results.flatMap((exp) => [
        ...Object.keys(exp.inputs || {}),
        ...Object.keys(exp.outputs || {})
      ])
    )
  ];

  return (
    <div className="min-h-screen bg-white p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Experiments</h1>

      <input
        type="text"
        className="w-full p-3 border rounded mb-4"
        placeholder="e.g. Mixing Temperature > 180 and Viscosity < 8"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={fetchSuggestions}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💡 Suggest New Experiments
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            {results.map((exp, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded bg-gray-50">
                <h3 className="font-bold">{exp.name}</h3>
                <p className="text-sm">Inputs: {JSON.stringify(exp.inputs)}</p>
                <p className="text-sm">Outputs: {JSON.stringify(exp.outputs)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Visualization</h2>
            <div className="flex space-x-4 mb-4">
              <div>
                <label className="text-sm font-medium">X-axis:</label>
                <select
                  className="border p-2 rounded ml-2"
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                >
                  {allFields.map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Y-axis:</label>
                <select
                  className="border p-2 rounded ml-2"
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                >
                  {allFields.map((f, i) => (
                    <option key={i} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name={xAxis} />
                <YAxis type="number" dataKey="y" name={yAxis} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Experiments" data={getScatterData()} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {suggestions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">🔍 Suggested Experiments</h2>
          {suggestions.map((s, i) => (
            <div key={i} className="mb-4 p-4 border rounded bg-green-50">
              <p><b>Suggested Inputs:</b> {JSON.stringify(s.inputs)}</p>
              <p><b>Why:</b> {s.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

