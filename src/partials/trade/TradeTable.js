import { useMemo } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

import { toFriendlyTimeFormat } from "../../utils/Utils";
import { toShort18 } from "../../utils/Contract";
import "../../css/table.css";

const mapAnswers = {
  LONG: "YES",
  SHORT: "NO",
};

const TradeTable = ({ trades, loading }) => {
  const data = useMemo(
    () =>
      (trades &&
        trades.map((trade) => ({
          ...trade,
          answer: mapAnswers[trade.answer],
          amount: toShort18(trade.amount).toFixed(2),
          timestamp: toFriendlyTimeFormat(trade.timestamp),
        }))) ||
      [],
    [trades]
  );

  const columns = [
    {
      Header: "Transaction ID",
      accessor: "transaction",
    },
    {
      Header: "Type",
      accessor: "status",
    },
    {
      Header: "Order",
      accessor: "answer",
    },
    {
      Header: "Trader",
      accessor: "trader",
    },
    {
      Header: "Amount (USDx)",
      accessor: "amount",
    },
    {
      Header: "Date Time",
      accessor: "timestamp",
    },
  ];

  return (
    <div>
      <ReactTable
        loading={loading}
        data={data}
        columns={columns}
        defaultPageSize={10}
        pageSizeOptions={[5, 10]}
        className="bg-secondary text-white font-bold text-center"
      />
    </div>
  );
};

export default TradeTable;
