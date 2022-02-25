import React, { useMemo } from "react";
// import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Skeleton from "@mui/material/Skeleton";
import Stakedtable from "./Stakedtable";

import { useFinance } from "../../context/finance";
import { useTransaction } from "../../context/transaction";
import { toShort18 } from "../../utils/Contract";

const Stakedtabs = () => {
  const { balances, transferableDVDX, loadingBalances } = useFinance();
  const { loading: loadingStakings, stakeTransactions } = useTransaction();

  const stakedDVDX = useMemo(() => {
    if (!balances || !balances.dvdx) return "0.0000";

    return toShort18(balances.dvdx.minus(transferableDVDX).toFixed()).toFixed(
      4,
      1
    );
  }, [balances, transferableDVDX]);

  // const [selectedIndex, setSelectedIndex] = useState(0);

  // const handleSelect = (index) => {
  //   setSelectedIndex(index);
  // };

  // return (
  //   <Tabs selectedIndex={selectedIndex} onSelect={handleSelect}>
  //     <TabList>
  //       <Tab>Staked</Tab>
  //       <Tab>Derived</Tab>
  //     </TabList>
  //     <TabPanel>
  //       <div className="p-4 mx-3 h-16 bg-gradient-to-r from-gradient1 to-gradient2 text-textPrimary flex justify-between items-center rounded-lg">
  //         <h1 className="text-white text-xl font-bold font-heading">
  //           Staked Tokens
  //         </h1>
  //         <h1 className="text-white text-xl font-bold font-heading">$0.0000</h1>
  //       </div>
  //       <Stakedtable className="w-full" />
  //       <div className="flex justify-center md:justify-start"></div>
  //     </TabPanel>
  //     <TabPanel>
  //       <div className="p-4 mx-3 h-16 bg-gradient-to-r from-gradient1 to-gradient2 text-textPrimary flex justify-between items-center rounded-lg">
  //         <h1 className="text-white text-xl font-bold font-heading">
  //           Derived Assets
  //         </h1>
  //         <h1 className="text-white text-xl font-bold font-heading">$0.0000</h1>
  //       </div>
  //       <Stakedtable />
  //       <div className="flex justify-center md:justify-start"></div>
  //     </TabPanel>
  //   </Tabs>
  // );

  return (
    <div className="p-4">
      <div className="mx-6 px-4 h-16 bg-gradient-to-r from-gradient1 to-gradient2 text-textPrimary flex justify-between items-center rounded-lg">
        <h1 className="text-white text-xl font-bold font-heading">
          Staked Tokens
        </h1>
        {loadingBalances ? (
          <Skeleton width={300} height={50} />
        ) : (
          <h1 className="text-white text-xl font-bold font-heading">
            {stakedDVDX} DVDX
          </h1>
        )}
      </div>
      <Stakedtable
        className="w-full"
        loading={loadingStakings}
        transactions={stakeTransactions}
      />
      <div className="flex justify-center md:justify-start"></div>
    </div>
  );
};

export default Stakedtabs;
