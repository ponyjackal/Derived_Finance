import {
  // useEffect,
  useState
} from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css"

// import { useWeb3React } from "@web3-react/core";
// import { useParams } from "react-router-dom";
// import { useMarket } from "../../context/market";
// import { toShort18 } from "../../utils/Contract";

import "../../css/table.css"

// export class Marketposition extends Component {
//   render() {
//     const data = [
//     ];
//     const columns = [
//       {
//         Header: "Outcome",
//         accessor: "outcome",
//       },
//       {
//         Header: "Price: Avg | Cur.",
//         accessor: "price",
//       },
//       {
//         Header: "P/L: $ | %",
//         accessor: "pl",
//       },
//       {
//         Header: "Value: Init. | Cur.",
//         accessor: "value",
//       },
//       {
//         Header: "Max. Payout",
//         accessor: "max_payout",
//       },
//     ];
//     return (
//       <div>
//         <ReactTable
//           data={data}
//           columns={columns}
//           defaultPageSize={5}
//           pageSizeOptions={[5, 10]}
//           className="bg-secondary text-white font-bold text-center m-6 rounded-lg"
//         />
//       </div>
//     );
//   }
// }

const Marketposition = ({ positions }) => {
  // const { account } = useWeb3React();
  // const { questionId } = useParams();
  const [
    loading,
    // setLoading
  ] = useState(false);
  // const [positions, setPositions] = useState([]);
  // const { MarketContract, DerivedTokenContract } = useMarket();
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

  /*
  useEffect(() => {
    if (!questionId || !account || !MarketContract || !DerivedTokenContract) return;

    const initialize = async () => {
      setLoading(true);

      const longId = await MarketContract.generateAnswerId(questionId, 0);
      const shortId = await MarketContract.generateAnswerId(questionId, 1);

      const longBalance = await MarketContract.balanceOf(account, longId);
      const shortBalancee = await MarketContract.balanceOf(account, shortId);

      setLoading(false);
    };

    initialize();
  }, [questionId, account, MarketContract, DerivedTokenContract]);
  */

  return (
    <div>
      <ReactTable
        loading={loading}
        data={[]}
        columns={columns}
        defaultPageSize={5}
        pageSizeOptions={[5, 10]}
        className="bg-secondary text-white font-bold text-center m-6 rounded-lg"
      />
    </div>
  );
};

export default Marketposition;
