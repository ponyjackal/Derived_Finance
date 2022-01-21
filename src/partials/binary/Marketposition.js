import {
  useEffect,
  useState
} from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css"

import { BigNumber } from 'bignumber.js';
import "../../css/table.css"

const Marketposition = ({ long, short, balances, loading: loadingPositions }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const columns = [
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Shares Amount",
      accessor: "amount",
    },
    {
      Header: "Price: Avg | Cur.",
      accessor: "price",
    },
    {
      Header: "USDx Revenue",
      accessor: "revenue",
    },
  ];

  useEffect(() => {
    const initialize = () => {
      setLoading(true);

      const value = [];

      if (!balances[0].isEqualTo(new BigNumber(0))) {
        const amount = balances[0].toFixed(2);
        value.push({
          amount,
          type: "YES",
          price: long,
          revenue: new BigNumber(long).multipliedBy(new BigNumber(amount)).toFixed(2),
        });
      }

      if (!balances[1].isEqualTo(new BigNumber(0))) {
        const amount = balances[1].toFixed(2);
        value.push({
          amount,
          type: "NO",
          price: short,
          revenue: new BigNumber(long).multipliedBy(new BigNumber(amount)).toFixed(2),
        });
      }

      setData(value);

      setLoading(false);
    };

    initialize();
  }, [long, short, balances]);

  return (
    <div>
      <ReactTable
        loading={loading || loadingPositions}
        data={data}
        columns={columns}
        defaultPageSize={5}
        pageSizeOptions={[5, 10]}
        className="bg-secondary text-white font-bold text-center m-6 rounded-lg"
      />
    </div>
  );
};

export default Marketposition;
