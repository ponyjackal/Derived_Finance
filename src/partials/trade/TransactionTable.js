import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import "../../css/table.css";

import { useChain } from "../../context/chain";
import { getTransactions } from "../../services/etherscan";

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

const Transactiontable = () => {
  const { chainId } = useWeb3React();
  const { DVDXContract } = useChain();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const res = await getTransactions(chainId, DVDXContract.address);
      setData([]);
      console.log('DEBUG-res: ', { res });
    } catch (error) {
      console.error('Fetch transaction error: ', error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    chainId && DVDXContract && fetchTransactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, DVDXContract]);

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
