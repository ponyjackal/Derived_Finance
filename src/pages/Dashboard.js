import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import LockedValue from "../partials/dashboard/LockedValue";
import ValueBanner from "../partials/dashboard/ValueBanner";
import Balances from "../partials/dashboard/Balances";
import Footer from "../partials/Footer";
import Collapsable from "../partials/dashboard/Collapsable";
import DeAssetBalance from "../partials/dashboard/DeAssetBalance";
import Staking from "../partials/dashboard/Staking";
import TransactionList from "../partials/dashboard/TransactionList";

import meta from "../images/meta-mask.png";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-primary">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Avatars */}
              {/* <DashboardAvatars /> */}

              {/* Right: Actions */}
              <div className="flex w-full items-center justify-center bg-secondary rounded-lg">
                <LockedValue />
              </div>
            </div>

            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <ValueBanner />
            </div>

            <div className="flex w-full items-center justify-between bg-secondary rounded-lg mb-8">
              <Balances />
            </div>

            <div className="mb-8">
              <div className="w-100">
                <Collapsable
                  label="DeAssets Balances"
                  description="Overview of your DeAsset Holdings"
                  content={<img className="ml-3 w-6" src={meta} alt="" />}
                >
                  <DeAssetBalance />
                </Collapsable>
                <Collapsable
                  label="Staking"
                  description="Overview of your staking information"
                  content={
                    <p className="ml-3 md:text-md text-xs">
                      You can stake DVDX tokens to mint USDx and earn DVDX
                      rewards as well
                    </p>
                  }
                >
                  <Staking />
                </Collapsable>
                {/* <Collapsable
                  label="Short Positions"
                  description="Overview of your short positions"
                  content={
                    <p className="ml-3 md:text-md text-xs">
                      You can short-sell any DeAsset by collateralizing DVDX.
                    </p>
                  }
                >
                  <div>
                    <p>No Data Available</p>
                  </div>
                </Collapsable> */}
                <Collapsable
                  label="Transaction History"
                  description="Record of all your transactions"
                  content={
                    <p className="ml-3 md:text-md text-xs">
                      View all your transactions on Derived Finance Related to
                      your amount.
                    </p>
                  }
                >
                  <TransactionList />
                </Collapsable>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        {/* <Banner /> */}
      </div>
    </div>
  );
}

export default Dashboard;
