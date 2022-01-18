import React, { useRef, useEffect } from "react";

import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";

// Import utilities
import { tailwindConfig, formatValue } from "../utils/Utils";

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip
);

function TradeChart({ data, width, height }) {
  const canvas = useRef(null);
  const longValue = useRef(null);
  const longChange = useRef(null);
  const shortValue = useRef(null);
  const shortChange = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    // eslint-disable-next-line no-unused-vars
    const chart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
            },
            suggestedMin: 0,
            suggestedMax: 1,
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatValue(value),
            },
          },
          x: {
            type: "time",
            time: {
              parser: "hh:mm:ss",
              unit: "second",
              tooltipFormat: "MMM DD, H:mm:ss a",
              displayFormats: {
                second: "H:mm:ss",
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              autoSkipPadding: 48,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            titleFont: {
              weight: "600",
            },
            callbacks: {
              label: (context) => formatValue(context.parsed.y),
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        animation: false,
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });

    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Update header values
  useEffect(() => {
    if (data.datasets[0].data.length === 0) {
      longValue.current.innerHTML = "0.00";
      shortValue.current.innerHTML = "0.00";
    } else {
      const currentLongValue =
        data.datasets[0].data[data.datasets[0].data.length - 1];
      const previousLongValue =
        data.datasets[0].data[data.datasets[0].data.length - 2];
      const longDiff =
        ((currentLongValue - previousLongValue) / previousLongValue) * 100;

      const currentShortValue =
        data.datasets[1].data[data.datasets[1].data.length - 1];
      const previousShortValue =
        data.datasets[1].data[data.datasets[1].data.length - 2];
      const shortDiff =
        ((currentShortValue - previousShortValue) / previousShortValue) * 100;

      longValue.current.innerHTML =
        data.datasets[0].data[data.datasets[0].data.length - 1] || 0;
      shortValue.current.innerHTML =
        data.datasets[1].data[data.datasets[1].data.length - 1] || 0;

      if (longDiff < 0) {
        longChange.current.style.backgroundColor =
          tailwindConfig().theme.colors.yellow[500];
      } else {
        longChange.current.style.backgroundColor =
          tailwindConfig().theme.colors.green[500];
      }

      if (shortDiff < 0) {
        shortChange.current.style.backgroundColor =
          tailwindConfig().theme.colors.yellow[500];
      } else {
        shortChange.current.style.backgroundColor =
          tailwindConfig().theme.colors.green[500];
      }

      longChange.current.innerHTML = !longDiff
        ? "0.00%"
        : `${longDiff > 0 ? "+" : ""}${longDiff.toFixed(2)}%`;
      shortChange.current.innerHTML = !shortDiff
        ? "0.00%"
        : `${shortDiff > 0 ? "+" : ""}${shortDiff.toFixed(2)}%`;
    }
  }, [data]);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800 mr-2 tabular-nums">
              $<span ref={longValue}>0.5</span>
            </div>
            <div
              ref={longChange}
              className="text-sm font-semibold text-white px-1.5 rounded-full"
            ></div>
          </div>
          &nbsp;&nbsp;&nbsp;
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-800 mr-2 tabular-nums">
              $<span ref={shortValue}>0.5</span>
            </div>
            <div
              ref={shortChange}
              className="text-sm font-semibold text-white px-1.5 rounded-full"
            ></div>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <canvas ref={canvas} data={data} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default TradeChart;
