import React, { useMemo } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

import { METHOD_TOPICS } from "../../utils/Contract";
import { toFriendlyTimeFormat } from "../../utils/Utils";
import { useTransaction } from "../../context/transaction";

// const columns = [
//   {
//     Header: "Transaction ID",
//     accessor: "transaction_id",
//   },
//   {
//     Header: "Type",
//     accessor: "type",
//   },
//   {
//     Header: "Date Time",
//     accessor: "date_time",
//   },
//   {
//     Header: "Amount",
//     accessor: "amount",
//   },
//   {
//     Header: "Status",
//     accessor: "status",
//   },
//   {
//     Header: "Value",
//     accessor: "value",
//   },
// ];
const columns = [
  {
    Header: "Hash",
    accessor: "hash",
  },
  {
    Header: "From",
    accessor: "from",
  },
  {
    Header: "Type",
    accessor: "type",
  },
  {
    Header: "Timestamp",
    accessor: "timestamp",
  },
];

const Transactiontable = () => {
  const { loading, stakeTransactions: transactions } = useTransaction();
  const data = useMemo(() => {
    return transactions
      .filter((transaction) =>
        transaction.input.includes(METHOD_TOPICS.EXCHANGE_SYNTH)
      )
      .map((tx) => ({
        from: tx.from,
        hash: tx.hash,
        type: "EXCHANGE",
        timestamp: toFriendlyTimeFormat(parseInt(tx.timeStamp, 10)),
      }));
  }, [transactions]);

  return (
    <div>
      <ReactTable
        data={data}
        columns={columns}
        loading={loading}
        defaultPageSize={10}
        pageSizeOptions={[5, 10]}
        className="bg-secondary text-white font-bold text-center"
      />
    </div>
  );
};

export default Transactiontable;
