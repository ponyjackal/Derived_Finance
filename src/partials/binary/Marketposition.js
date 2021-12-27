import React, { Component } from "react";
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css" 
import "../../css/table.css"

export class Marketposition extends Component {
  render() {
    const data = [
    ];
    const columns = [
      {
        Header: "Outcome",
        accessor: "outcome",
      },
      {
        Header: "Price: Avg | Cur.",
        accessor: "price",
      },
      {
        Header: "P/L: $ | %",
        accessor: "pl",
      },
      {
        Header: "Value: Init. | Cur.",
        accessor: "value",
      },
      {
        Header: "Max. Payout",
        accessor: "max_payout",
      },
    ];
    return (
      <div>
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={5}
          pageSizeOptions={[5, 10]}
          className="bg-secondary text-white font-bold text-center m-6 rounded-lg"
        />
      </div>
    );
  }
}

export default Marketposition;
