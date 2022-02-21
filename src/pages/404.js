import React, { useState } from "react";
import Typography from "@mui/material/Typography";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

const NotFound = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="h-full flex justify-center items-center">
          <Typography variant="h2" gutterBottom component="div">
            404 Not Found
          </Typography>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;
