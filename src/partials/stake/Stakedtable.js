import { useMemo } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

import { toFriendlyTimeFormat } from "../../utils/Utils";
import { METHOD_TOPICS } from "../../utils/Contract";

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
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Timestamp",
      accessor: "timestamp",
    },
  ];
  const data = useMemo(() => {
    if (!transactions) return [];

    return transactions
      .filter(
        (tx) =>
          tx.input.includes(METHOD_TOPICS.ISSUE_SYNTH) ||
          tx.input.includes(METHOD_TOPICS.BURN_SYNTH)
      )
      .map((tx) => ({
        from: tx.from,
        hash: tx.hash,
        type: tx.input.includes(METHOD_TOPICS.ISSUE_SYNTH) ? "MINT" : "BURN",
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
