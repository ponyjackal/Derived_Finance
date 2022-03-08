import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Ongoingtabs from "../partials/binary/Ongoingtabs";
import Binarysecondtab from "../partials/binary/Binarysecondtab";

function Binary() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleChangeSortBy = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 m-5 bg-secondary rounded-lg">
            <p className="text-white text-2xl font-bold">
              On-chain exposure to any asset class
            </p>
            <p className="text-white text-lg">
              Trade Cryptocurrency Options (Long and Short).
            </p>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-8 m-5 bg-secondary rounded-lg flex md:flex-row flex-col items-center justify-between">
            <Binarysecondtab
              category={category}
              sortBy={sortBy}
              onChangeCategory={handleChangeCategory}
              onChangeSortBy={handleChangeSortBy}
            />
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-8 m-5 rounded-lg">
            <Ongoingtabs category={category} sortBy={sortBy} />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Binary;
