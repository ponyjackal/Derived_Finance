import Stakedtable from "../../partials/stake/Stakedtable";

import { useTransaction } from "../../context/transaction";

const TransactionList = () => {
  const { loading: loadingStakings, stakeTransactions } = useTransaction();

  return (
    <div className="w-full">
      <Stakedtable
        className="w-full"
        loading={loadingStakings}
        transactions={stakeTransactions}
      />
    </div>
  );
};

export default TransactionList;
