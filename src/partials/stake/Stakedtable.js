import React, { Component } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

export class Stakedtable extends Component {
  render() {
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
          data={data}
          columns={columns}
          defaultPageSize={3}
          pageSizeOptions={[5, 10]}
          className="bg-primary text-white font-bold text-center m-6 rounded-lg"
        />
      </div>
    );
  }
}

export default Stakedtable;
