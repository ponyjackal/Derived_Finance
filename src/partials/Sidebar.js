/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
// import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
// import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
// import LockIcon from "@mui/icons-material/Lock";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { useMarket } from "../context/market";
import { useDisclaimer } from "../context/disclaimer";

import LogoIcon from "../images/logo.png";
import MobileLogoIcon from "../images/mob-logo.png";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#86C440",
  backgroundColor: "#18252D",
  cursor: "pointer",
}));

const MOBILE_WIDTH = 1536;

function SocialButton({ sidebarExpanded }) {
  return (
    <React.Fragment>
      <Grid item sm={sidebarExpanded ? 4 : 12}>
        <Item>
          <a href="https://derived.fi/" target="_blank" rel="noreferrer">
            <LanguageOutlinedIcon />
          </a>
        </Item>
      </Grid>
      <Grid item sm={sidebarExpanded ? 4 : 12}>
        <Item>
          <a href="https://t.me/derivedFi" target="_blank" rel="noreferrer">
            <TelegramIcon />
          </a>
        </Item>
      </Grid>
      <Grid item sm={sidebarExpanded ? 4 : 12}>
        <Item>
          <a
            href="https://twitter.com/DerivedFinance"
            target="_blank"
            rel="noreferrer"
          >
            <TwitterIcon />
          </a>
        </Item>
      </Grid>
      <Grid item sm={sidebarExpanded ? 4 : 12}>
        <Item>
          <a
            href="https://github.com/DerivedFinance"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon />
          </a>
        </Item>
      </Grid>
      <Grid item sm={sidebarExpanded ? 4 : 12}>
        <Item>
          <a
            href="https://github.com/DerivedFinance/Whitepaper"
            target="_blank"
            rel="noreferrer"
          >
            <DescriptionOutlinedIcon />
          </a>
        </Item>
      </Grid>
      <Grid item sm={sidebarExpanded ? 4 : 12}>
        <Item className="flex justify-center">
          <a
            href="https://medium.com/@DerivedFinance"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              fill="#86C440"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              className="h-6 w-7"
            >
              {" "}
              <path d="M 3 6 L 7 11.091797 L 7 35.285156 L 1 43 L 15 43 L 9 35.285156 L 9 13.75 L 22 43 L 21.998047 43.013672 L 34 13.544922 L 34 39 L 30 43 L 47 43 L 43 39 L 42.972656 10.503906 L 46.863281 6.0136719 L 34.845703 6.0136719 L 25.605469 28.744141 L 15.496094 6 L 3 6 z" />
            </svg>
          </a>
        </Item>
      </Grid>
    </React.Fragment>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { isMarketOwner } = useMarket();
  const { showDisclaimer } = useDisclaimer();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );
  const [showSidebar, setShowSidebar] = useState(false);

  // const handleShowPrivacy = () => {};

  const isSidebarExpanded = useMemo(
    () => showSidebar | sidebarExpanded,
    [showSidebar, sidebarExpanded]
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    const handleResizeWindow = () => {
      setShowSidebar(
        window.document.documentElement.clientWidth > MOBILE_WIDTH
      );
    };

    window.addEventListener("resize", handleResizeWindow);
    handleResizeWindow();

    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 flex-shrink-0 bg-secondary p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        {/* Close button */}
        <button
          ref={trigger}
          className="lg:hidden text-white hover:text-gray-400"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <span className="sr-only">Close sidebar</span>
          <svg
            className="w-6 h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
          </svg>
        </button>

        {/* Expand / collapse button */}
        <div className="hidden lg:inline-flex 2xl:hidden justify-center">
          <div>
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="bg-headings p-2 rounded-lg"
            >
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-4 h-4 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-gray-200"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-gray-200" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex mb-7 pr-3 sm:pr-2 my-4">
          {/* Logo */}
          <NavLink
            id="derived-logo"
            exact
            to="/"
            className="flex items-center p-2"
          >
            <img
              alt="derived logo"
              src={LogoIcon}
              className={sidebarExpanded ? "block" : "hidden 2xl:block"}
            />
            <img
              alt="drivedd logo"
              src={MobileLogoIcon}
              className={sidebarExpanded ? "hidden" : "block 2xl:hidden"}
            />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <ul className="mt-3">
              {/* Dashboard */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
                  pathname === "/" && "bg-headings"
                }`}
              >
                <Link to="/">
                  <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                    <DashboardOutlinedIcon />
                    <span className="font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Dashboard
                    </span>
                  </div>
                </Link>
              </li>
              {/* Trade */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
                  pathname === "/Trade" && "bg-headings"
                }`}
              >
                <Link to="/Trade">
                  <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                    <CompareArrowsOutlinedIcon />
                    <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Trade
                    </span>
                  </div>
                </Link>
              </li>
              {/* Stake */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
                  pathname === "/Stake" && "bg-headings"
                }`}
              >
                <Link to="/Stake">
                  <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                    <PriceCheckOutlinedIcon />
                    <span className="font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Stake
                    </span>
                  </div>
                </Link>
              </li>
              {/* Exchange */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
                  pathname === "/Exchange" && "bg-headings"
                }`}
              >
                <Link to="/Exchange">
                  <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                    <CurrencyExchangeIcon />
                    <span className="font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Exchange
                    </span>
                  </div>
                </Link>
              </li>
              {/* Farming/LP */}
              {/* <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === "/Farming" && "bg-headings"
                  }`}
              >
                <Link to="/Farming">
                  <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                    <CorporateFareOutlinedIcon />
                    <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Farming/LP
                    </span>
                  </div>
                </Link>
              </li> */}
              {/* Binary Options */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
                  (pathname === "/Binary" ||
                    pathname.includes("Binaryoptionsinside")) &&
                  "bg-headings"
                }`}
              >
                <Link to="/Binary">
                  <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                    <ReceiptLongOutlinedIcon />
                    <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 hover:text-white">
                      Binary Options
                    </span>
                  </div>
                </Link>
              </li>
              {/* Binary Options Admin */}
              {isMarketOwner && (
                <li
                  className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${
                    (pathname === "/Admin" || pathname.includes("Admin")) &&
                    "bg-headings"
                  }`}
                >
                  <Link to="/Admin">
                    <div className="flex items-center text-white hover:text-gray-200 truncate transition duration-150">
                      <AdminPanelSettingsIcon />
                      <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 hover:text-white">
                        Admin
                      </span>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-3 justify-center mt-5 flex flex-col">
          <button className="bg-primary shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg text-base">
            <a
              href="https://www.coingecko.com/en/coins/derived"
              target="_blank"
              rel="noreferrer"
              className="flex justify-center"
            >
              <AdminPanelSettingsOutlinedIcon
                className={
                  isSidebarExpanded ? "text-headings mr-2" : "text-headings"
                }
              />{" "}
              {isSidebarExpanded ? "DVDX Price" : ""}
            </a>
          </button>
          {/* <button className="bg-primary shadow-2xl text-white font-regular py-2 px-4 rounded my-3 font-heading text-sm hover:drop-shadow-lg text-base">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="flex justify-center"
            >
              <AddCircleOutlineOutlinedIcon
                className={
                  isSidebarExpanded ? "text-headings mr-2" : "text-headings"
                }
              />{" "}
              {isSidebarExpanded ? "Sign Up for updates" : ""}
            </a>
          </button> */}
        </div>

        <div className="pt-3 justify-center mt-5 flex flex-col">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid container item spacing={3}>
                <SocialButton
                  className="bg-primary hover:drop-shadow-lg"
                  sidebarExpanded={isSidebarExpanded}
                />
              </Grid>
            </Grid>
          </Box>
        </div>

        <div className="pt-3 justify-center mt-5 flex flex-col">
          {/* <button className="bg-primary shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
            <a
              href="javascript:;"
              className="text-headings my-2 font-heading text-base flex justify-center"
              onClick={handleShowPrivacy}
            >
              <LockIcon className={isSidebarExpanded ? "mr-3" : ""} />
              {isSidebarExpanded ? "Privacy Policy" : ""}
            </a>
          </button> */}
          <button className="bg-primary shadow-2xl text-white font-regular py-2 px-4 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
            <a
              href="javascript:;"
              className="text-headings my-2 font-heading text-base flex justify-center"
              onClick={showDisclaimer}
            >
              <PanToolOutlinedIcon
                className={isSidebarExpanded ? "mr-3" : ""}
              />
              {isSidebarExpanded ? "Disclaimer" : ""}
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
