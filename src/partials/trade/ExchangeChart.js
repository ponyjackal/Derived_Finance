import React, { useState, useEffect, useMemo } from "react";

import RealtimeChart from "../../charts/RealtimeChart";
import { tailwindConfig, hexToRGB } from "../../utils/Utils";
import { getCoinPrices } from "../../services/coingecko";
import { AVAILALBE_TOKENS } from "../../utils/Tokens";

const ExchangeChart = ({ fromToken, toToken }) => {
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState([]);

  const labels = useMemo(() => trades.map((trade) => trade[0]), [trades]);
  const data = useMemo(() => trades.map((trade) => trade[1]), [trades]);
  const chartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data,
          fill: true,
          backgroundColor: `rgba(${hexToRGB(
            tailwindConfig().theme.colors.blue[500]
          )}, 0.08)`,
          borderColor: tailwindConfig().theme.colors.headings,
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.white[500],
          clip: 20,
        },
      ],
    };
  }, [labels, data]);

  const fetchPrices = async (coinId) => {
    setLoading(true);

    try {
      const res = await getCoinPrices(coinId, 1, 1000 * 60 * 24);
      setTrades(res.prices);
    } catch (error) {
      console.error("Exchange error: ", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    const token =
      AVAILALBE_TOKENS.find((t) => t.key === fromToken) ||
      AVAILALBE_TOKENS.find((t) => t.key === toToken);

    token && fetchPrices(token.coinId);
  }, [fromToken, toToken]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-primary shadow-lg rounded-sm border border-gray-200">
      <header className="px-5 py-4 border-b border-gray-100 flex items-center">
        <h2 className="font-semibold text-white">Trade Prices</h2>
      </header>
      {loading ? (
        <div className="w-full h-full flex justify-center items-center p-4">
        <p>Loading...</p>
      </div>
      ) : (
        <RealtimeChart
          data={chartData}
          width={595}
          height={200}
          className="text-white"
        />
      )}
    </div>
  );
};

export default ExchangeChart;
