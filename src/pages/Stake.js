import React, { useState } from "react";
import Valueblocks from "../partials/stake/Valueblocks";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Withdrawtabs from "../partials/stake/Withdrawtabs";
import Stakedtabs from "../partials/stake/Stakedtabs";
import Rewards from "../partials/stake/Rewards";

function Stake() {
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
                <Valueblocks />
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="w-full lg:flex gap-4 px-8 mb-6">
              <div className="lg:w-3/5 bg-secondary rounded-lg">
                <Withdrawtabs />
              </div>
              <div className="lg:w-2/5 bg-secondary px-4 rounded-lg">
                <Rewards />
              </div>
            </div>
            <div className="w-full px-8">
              <div className="bg-secondary rounded-lg">
                <Stakedtabs />
              </div>
            </div>
          </div>
          {/* <div className="grid md:grid-rows-2 grid-rows-3 grid-flow-col gap-1 overflow-x-auto md:overflow-x-hidden px-4">
            <div className="sm:px-6 lg:px-8 py-8 w-full max-w-9xl bg-secondary pt-0 rounded-lg mx-2">
              <Withdrawtabs />
            </div>
            <div className="sm:px-6 lg:px-8 py-8 w-full max-w-9xl bg-secondary pt-0 rounded-lg mx-2">
              <Stakedtabs />
            </div>
            <div className="sm:px-6 lg:px-8 py-8 md:w-full max-w-9xl bg-secondary pt-0 w-4/12 rounded-lg mx-2">
              <Rewards />
            </div>
          </div> */}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Stake;
