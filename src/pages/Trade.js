import React, { useState } from "react";
import TradeBox from "../partials/trade/TradeBox";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import DashboardCard05 from "../partials/dashboard/DashboardCard05";
import Footer from "../partials/Footer";
import Cryptoslider from "../partials/trade/Cryptoslider";
import TransactionTable from "../partials/trade/TransactionTable";

function Trade() {
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
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto bg-primary">
            <p className="text-white text-3xl my-5">Trade</p>
            <div className="grid grid-cols-12 gap-2">
              <TradeBox />
              <DashboardCard05 style={{ height: "80%" }} />
              {/* <Chartselect/> */}
            </div>
            <div>
              <Cryptoslider />
              <h1 className="my-3 text-white text-2xl font-bold">
                Transaction History
              </h1>
              <div className="flex bg-secondary p-3 flex-col">
                <h1 className="text-white text-2xl font-bold mb-4">
                  Recent Trading
                </h1>
                <TransactionTable />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Trade;
