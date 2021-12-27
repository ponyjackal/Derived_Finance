import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Rewardtab from "../partials/farming/Rewardtab";
import Accordion from "../partials/farming/Accordion";
import Accordiontabs from "../partials/farming/Accordiontabs";
import InfoIcon from "@mui/icons-material/Info";
import meta from "../images/meta-mask.png";

function Farming() {
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
          <Rewardtab />
          <p className="text-white font-bold text-3xl px-8 py-10">Staked LP Tokens</p>
          <div>
            <div className="flex w-full items-center justify-between pb-2 rounded-lg p-3 pr-40 pl-16">
              <p className="text-white">Pool Name</p>
              <p className="text-white">Earned</p>
              <p className="text-white">vAPR</p>
              <p className="text-white">My Deposits</p>
              <p className="text-white">TVL</p>
            </div>
            <div className="flex w-full items-center justify-between rounded-lg pt-2 p-8">
              <Accordion>
                <div
                  label={
                    <div className="flex justify-between items-center w-11/12">
                      <div className="flex items-center">
                        <img
                          src={meta}
                          alt="MetaMask"
                          className="w-8 h-8 mr-2"
                        />
                        <p className="text-white text-base">Compound</p>
                      </div>
                      <p className="text-white text-base">$0</p>

                      <p
                        className="text-white text-base flex items-center"
                        title="Average APY(Based on your total debt value)"
                      >
                        11.83%(proj. 6.82%)
                        <InfoIcon
                          style={{ fontSize: "20px", marginLeft: "5px" }}
                        />
                      </p>
                      <p className="text-white text-base">-cCv</p>
                      <p className="text-white text-base">$184.7m</p>
                    </div>
                  }
                >
                  <div className="w-full">
                    <Accordiontabs />
                  </div>
                </div>
                <div
                  label={
                    <div className="flex justify-between items-center w-11/12">
                      <div className="flex items-center">
                        <img
                          src={meta}
                          alt="MetaMask"
                          className="w-8 h-8 mr-2"
                        />
                        <p className="text-white text-base">Compound</p>
                      </div>
                      <p className="text-white text-base">$0</p>
                      <p
                        className="text-white text-base flex items-center"
                        title="Average APY(Based on your total debt value)"
                      >
                        11.83%(proj. 6.82%)
                        <InfoIcon
                          style={{ fontSize: "20px", marginLeft: "5px" }}
                        />
                      </p>
                      <p className="text-white text-base">-cCv</p>
                      <p className="text-white text-base">$184.7m</p>
                    </div>
                  }
                >
                  <div className="w-full">
                    <Accordiontabs />
                  </div>
                </div>
                <div
                  label={
                    <div className="flex justify-between items-center w-11/12">
                      <div className="flex items-center">
                        <img
                          src={meta}
                          alt="MetaMask"
                          className="w-8 h-8 mr-2"
                        />
                        <p className="text-white text-base">Compound</p>
                      </div>
                      <p className="text-white text-base">$0</p>

                      <p
                        className="text-white text-base flex items-center"
                        title="Average APY(Based on your total debt value)"
                      >
                        11.83%(proj. 6.82%)
                        <InfoIcon
                          style={{ fontSize: "20px", marginLeft: "5px" }}
                        />
                      </p>
                      <p className="text-white text-base">-cCv</p>
                      <p className="text-white text-base">$184.7m</p>
                    </div>
                  }
                >
                  <div className="w-full">
                    <Accordiontabs />
                  </div>
                </div>
                <div
                  label={
                    <div className="flex justify-between items-center w-11/12">
                      <div className="flex items-center">
                        <img
                          src={meta}
                          alt="MetaMask"
                          className="w-8 h-8 mr-2"
                        />
                        <p className="text-white text-base">Compound</p>
                      </div>
                      <p className="text-white text-base">$0</p>

                      <p
                        className="text-white text-base flex items-center"
                        title="Average APY(Based on your total debt value)"
                      >
                        11.83%(proj. 6.82%)
                        <InfoIcon
                          style={{ fontSize: "20px", marginLeft: "5px" }}
                        />
                      </p>
                      <p className="text-white text-base">-cCv</p>
                      <p className="text-white text-base">$184.7m</p>
                    </div>
                  }
                >
                  <div className="w-full">
                    <Accordiontabs />
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Farming;
