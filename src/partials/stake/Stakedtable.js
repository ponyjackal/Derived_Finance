import { useMemo } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

import { toFriendlyTimeFormat } from "../../utils/Utils";

const Stakedtable = ({ loading, transactions }) => {
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
      Header: "Amount",
      accessor: "amount",
    },
    {
      Header: "Timestamp",
      accessor: "timestamp",
    },
  ];
  const data = useMemo(() => {
    if (!transactions) return [];

    return transactions.map((tx) => ({
      from: tx.from,
      hash: tx.hash,
      amount: "0.0000",
      timestamp: toFriendlyTimeFormat(parseInt(tx.timeStamp, 10)),
    }));
  }, [transactions]);

  return (
    <div>
      <ReactTable
        loading={loading}
        data={data}
        columns={columns}
        defaultPageSize={5}
        pageSizeOptions={[5, 10]}
        className="bg-primary text-white font-bold text-center m-6 rounded-lg"
      />
    </div>
  );
};

export default Stakedtable;
