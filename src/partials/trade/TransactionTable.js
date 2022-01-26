import React, { Component } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

export class Transactiontable extends Component {
  render() {
    const data = [
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
      {
        transaction_id: "dr43r34r34r",
        type: "BTC/BCH",
        date_time: "04/11/21 06:30pm",
        amount: 80,
        status: "Success",
        value: "1.75%",
      },
    ];
    const columns = [
      {
        Header: "Transaction ID",
        accessor: "transaction_id",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Date Time",
        accessor: "date_time",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Value",
        accessor: "value",
      },
    ];

    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={10}
          pageSizeOptions={[5, 10]}
          className="bg-secondary text-white font-bold text-center"
        />
      </div>
    );
  }
}

export default Transactiontable;
