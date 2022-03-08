import { useMemo } from "react";

import TradeChart from "../../charts/TradeChart";
import { tailwindConfig, hexToRGB } from "../../utils/Utils";

const Chart = ({ prices }) => {
  const longPrices = useMemo(() => {
    return (prices && prices.map((price) => price.long)) || [];
  }, [prices]);

  const shortPrices = useMemo(() => {
    return (prices && prices.map((price) => price.short)) || [];
  }, [prices]);

  const labels = useMemo(() => {
    return (prices && prices.map((price) => price.index)) || [];
  }, [prices]);

  const chartData = {
    labels,
    datasets: [
      // Indigo line
      {
        data: longPrices,
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
      {
        data: shortPrices,
        fill: true,
        backgroundColor: `rgba(${hexToRGB(
          tailwindConfig().theme.colors.red[500]
        )}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.error,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.white[500],
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-primary shadow-lg rounded-sm border border-gray-200">
      <header className="px-5 py-4 border-b border-gray-100 flex items-center">
        <h2 className="font-semibold text-white">Trade Prices</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <TradeChart
        data={chartData}
        width={595}
        height={200}
        className="text-white"
      />
    </div>
  );
};

export default Chart;
