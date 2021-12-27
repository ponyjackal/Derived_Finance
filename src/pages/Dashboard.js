import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import LockedValue from "../partials/dashboard/LockedValue";
import ValueBanner from "../partials/dashboard/ValueBanner";
import Balances from "../partials/dashboard/Balances";
import Footer from "../partials/Footer";
import Accordion from "../partials/dashboard/Accordion";
import meta from "../images/meta-mask.png"

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

            <div className="flex w-full items-center justify-between rounded-lg mb-8">
              <Accordion>
                <div
                  label={
                    <div className="flex items-center w-11/12">
                      <div className="w-1/3">
                        <div>
                          <p className="text-headings  md:text-md text-xs">
                            DeAssets Balances
                          </p>
                        </div>
                        <div>
                          <p className="text-white  md:text-md text-xs">
                            Overview of your DeAsset Holdings
                          </p>
                        </div>
                      </div>
                      <div style={{ borderLeft: "1px solid #86C440" }}>
                        <img className="ml-3 w-6" src={meta} alt=""/>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <p>No Data Available</p>
                  </div>
                </div>
                <div
                  label={
                    <div className="flex items-center w-11/12">
                      <div className="w-1/3">
                        <div>
                          <p className="text-headings  md:text-md text-xs">
                            Staking
                          </p>
                        </div>
                        <div>
                          <p className="text-white  md:text-md text-xs">
                            Overview of your staking information
                          </p>
                        </div>
                      </div>
                      <div style={{ borderLeft: "1px solid #86C440" }}>
                        <p className="ml-3 md:text-md text-xs">
                        You can stake DVDX tokens to mint USDx and earn DVDX rewards as well
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <p>No Data Available</p>
                  </div>
                </div>
                <div
                  label={
                    <div className="flex items-center w-11/12">
                      <div className="w-1/3">
                        <div>
                          <p className="text-headings  md:text-md text-xs">
                            Short Positions
                          </p>
                        </div>
                        <div>
                          <p className="text-white  md:text-md text-xs">
                            Overview of your short positions
                          </p>
                        </div>
                      </div>
                      <div style={{ borderLeft: "1px solid #86C440" }}>
                        <p className="ml-3 md:text-md text-xs">
                          You can short-sell any DeAsset by collateralizing DVDX.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <p>No Data Available</p>
                  </div>
                </div>
                <div
                  label={
                    <div className="flex items-center w-11/12">
                      <div className="w-1/3">
                        <div>
                          <p className="text-headings  md:text-md text-xs">
                            Transaction History
                          </p>
                        </div>
                        <div>
                          <p className="text-white  md:text-md text-xs">
                            Record of all your transactions{" "}
                          </p>
                        </div>
                      </div>
                      <div style={{ borderLeft: "1px solid #86C440" }}>
                        <p className="ml-3 md:text-md text-xs">
                          View all your transactions on Derived Finance Related
                          to your amount.
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div>
                    <p>No Data Available</p>
                  </div>
                </div>
              </Accordion>
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
