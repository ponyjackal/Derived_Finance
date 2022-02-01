import React from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

const Stakedtable = ({ loading }) => {
  const data = [];
  const columns = [
    {
      Header: "Token",
      accessor: "token",
    },
    {
      Header: "Balance",
      accessor: "balance",
    },
    {
      Header: "USD Value",
      accessor: "usd_value",
    },
  ];

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
