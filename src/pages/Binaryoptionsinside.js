import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Topbar from "../partials/binaryoptions/Topbar";
import DashboardCard05 from "../partials/dashboard/DashboardCard05";
import Buysell from "../partials/binary/Buysell";
import Marketposition from "../partials/binary/Marketposition";
import Aboutmarkettab from "../partials/binary/Aboutmarkettab";
import Transactiontable from "../partials/trade/Transactiontable";

function Binaryoptionsinside() {
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
          <Topbar />
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto bg-primary">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 transition-all">
              <DashboardCard05
                style={{ height: "80%" }}
                className="col-span-8"
              />
              <Buysell />
            </div>
          </div>
          <p className="text-white text-2xl font-bold mx-8">Market Positions</p>
          <Marketposition />
          <p className="text-white text-2xl font-bold underline decoration-secondary mx-8">
            About This Market
          </p>
          <div className="m-8">
            <p className="text-white font-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              eget ultricies dolor, id semper purus. Nam egestas vel nisl eget
              blandit. Nunc hendrerit purus id consequat auctor.{" "}
            </p>
            <p className="text-white font-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              eget ultricies dolor, id semper purus. Nam egestas vel nisl eget
              blandit. Nunc hendrerit purus id consequat auctor. Maecenas
              pharetra nisi ligula, vel ultrices nunc imperdiet{" "}
              <span className="text-blue-500">.....read more </span>
            </p>
          </div>
          <Aboutmarkettab />

          <div className="flex bg-secondary p-3 flex-col m-7 rounded-lg">
            <h1 className=" text-white text-2xl font-bold">Recent Trading</h1>
            <p className=" text-gray-600 text-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <Transactiontable />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Binaryoptionsinside;
