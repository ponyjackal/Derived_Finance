import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import BalanceBlocks from "../partials/exchange/BalanceBlocks";
import ExchangeBlock from "../partials/exchange/ExchangeBlock";

const Exchange = () => {
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
          <div className="p-8 w-full">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Right: Actions */}
              <div className="flex w-full items-center justify-center">
                <BalanceBlocks />
              </div>
            </div>
          </div>
          <div className="p-8 w-full">
            <ExchangeBlock />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Exchange;
