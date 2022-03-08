import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Rewardtab from "../partials/farming/Rewardtab";

import StakingList from "../partials/farming/StakingList";

function Farming() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tokens] = useState([
    { id: 1, name: "Compound-1" },
    { id: 2, name: "Compound-2" },
    { id: 3, name: "Compound-3" },
    { id: 4, name: "Compound-4" },
    { id: 5, name: "Compound-5" },
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <Rewardtab />
          <StakingList tokens={tokens} />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Farming;
