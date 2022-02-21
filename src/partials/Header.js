import React from "react";
// import SearchModal from "./header/SearchModal";
// import Notifications from "./header/Notifications";
import UserMenu from "./header/UserMenu";

function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="sticky top-0 bg-primary z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="4" y="5" width="16" height="2" />
                <rect x="4" y="11" width="16" height="2" />
                <rect x="4" y="17" width="16" height="2" />
              </svg>
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center flex-row">
              {/* <SearchModal /> */}
            </div>
            <div className="flex items-center flex-row">
              {/* <FullscreenOutlinedIcon
                className="bg-secondary mx-10 p-2 rounded-lg text-white"
                style={{ height: "40px", width: "40px" }}
              /> */}
            </div>
            <div className="flex items-center flex-row">
              {/* <Notifications/>
              <hr className="w-px h-6 bg-gray-200 mx-3" /> */}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
