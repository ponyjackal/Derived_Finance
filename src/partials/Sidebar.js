import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CompareArrowsOutlinedIcon from "@mui/icons-material/CompareArrowsOutlined";
import PriceCheckOutlinedIcon from "@mui/icons-material/PriceCheckOutlined";
import CorporateFareOutlinedIcon from "@mui/icons-material/CorporateFareOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LockIcon from "@mui/icons-material/Lock";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import LogoIcon from "../images/logo.png";
import MobileLogoIcon from "../images/mob-logo.png";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: "#86C440",
  backgroundColor: "#18252D",
  cursor: "pointer",
}));

function SocialButton() {
  return (
    <React.Fragment>
      <Grid item xs={4}>
        <Item>
          <a href="">
            <LanguageOutlinedIcon />
          </a>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
          <a href="">
            <TelegramIcon />
          </a>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
          <a href="">
            <TwitterIcon />
          </a>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
          <a href="">
            <GitHubIcon />
          </a>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item>
          <a href="">
            <DescriptionOutlinedIcon />
          </a>
        </Item>
      </Grid>
      <Grid item xs={4}>
        <Item className="flex justify-center">
          <svg
            fill="#86C440"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            className="h-6 w-7"
          >
            {" "}
            <path d="M 3 6 L 7 11.091797 L 7 35.285156 L 1 43 L 15 43 L 9 35.285156 L 9 13.75 L 22 43 L 21.998047 43.013672 L 34 13.544922 L 34 39 L 30 43 L 47 43 L 43 39 L 42.972656 10.503906 L 46.863281 6.0136719 L 34.845703 6.0136719 L 25.605469 28.744141 L 15.496094 6 L 3 6 z" />
          </svg>
        </Item>
      </Grid>
    </React.Fragment>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
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

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 flex-shrink-0 bg-secondary p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"
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
        <div className="hidden lg:inline-flex 2xl:hidden justify-end">
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
          <NavLink exact to="/" className="flex items-center ">
            <img alt="derived logo" src={LogoIcon} className="hidden md:block lg:hidden xl:block" />
            <img alt="drivedd logo" src={MobileLogoIcon} className="hidden lg:block xl:hidden" />
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <ul className="mt-3">
              {/* Dashboard */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === "/" && "bg-headings"
                  }`}
              >
                <NavLink
                  exact
                  to="/"
                  className={`block text-white hover:text-gray-200 truncate transition duration-150 ${pathname === "/" && "bg-headings"
                    }`}
                >
                  <Link to="/">
                    <div className="flex items-center">
                      <DashboardOutlinedIcon />
                      <span className="font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Dashboard
                      </span>
                    </div>
                  </Link>
                </NavLink>
              </li>
              {/* Trade */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === "/Trade" && "bg-headings"
                  }`}
              >
                <NavLink
                  exact
                  to="/Trade"
                  className={`block text-white hover:text-gray-200 truncate transition duration-150 ${pathname === "/trade" && "bg-headings"
                    }`}
                >
                  <Link to="/Trade">
                    <div className="flex items-center">
                      <CompareArrowsOutlinedIcon />
                      <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Trade
                      </span>
                    </div>
                  </Link>
                </NavLink>
              </li>
              {/* Stake */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === "/Stake" && "bg-headings"
                  }`}
              >
                <NavLink
                  exact
                  to="/"
                  className={`block text-white hover:text-gray-200 truncate transition duration-150 ${pathname === "/Stake" && "bg-headings"
                    }`}
                >
                  <Link to="/Stake">
                    <div className="flex items-center">
                      <PriceCheckOutlinedIcon />
                      <span className="font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Stake
                      </span>
                    </div>
                  </Link>
                </NavLink>
              </li>
              {/* Farming/LP */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === "/Farming" && "bg-headings"
                  }`}
              >
                <NavLink
                  exact
                  to="/"
                  className={`block text-white hover:text-gray-200 truncate transition duration-150 ${pathname === "/Farming" && "bg-headings"
                    }`}
                >
                  <Link to="/Farming">
                    <div className="flex items-center">
                      <CorporateFareOutlinedIcon />
                      <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Farming/LP
                      </span>
                    </div>
                  </Link>
                </NavLink>
              </li>
              {/* Binary Options */}
              <li
                className={`px-3 py-2 rounded-lg mb-0.5 last:mb-0 ${pathname === "/Binary" && "bg-headings"
                  }`}
              >
                <NavLink
                  exact
                  to="/"
                  className={`block text-white hover:text-gray-200 truncate transition duration-150 font-black ${pathname === "/Binary" && "bg-headings"
                    }`}
                >
                  <Link to="/Binary">
                    <div className="flex items-center">
                      <ReceiptLongOutlinedIcon />
                      <span className=" font-heading text-base font-bold ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200 hover:text-white">
                        Binary Options
                      </span>
                    </div>
                  </Link>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-3 2xl:hidden justify-center mt-5 flex flex-col lg:opacity-0 lg:sidebar-expanded:opacity-100 ">
          <button className="bg-primary shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg text-base">
            <a href="#">
              <AdminPanelSettingsOutlinedIcon className="text-headings mr-2" />{" "}
              DVDX Price
            </a>
          </button>
          <button className="bg-primary shadow-2xl text-white font-regular py-2 px-4 rounded my-3 font-heading text-sm hover:drop-shadow-lg text-base">
            <a href="#">
              <AddCircleOutlineOutlinedIcon className="text-headings mr-2" />{" "}
              Sign Up for updates
            </a>
          </button>
        </div>

        <div className="pt-3 2xl:hidden justify-center mt-5 flex flex-col lg:opacity-0 lg:sidebar-expanded:opacity-100 ">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid container item spacing={3}>
                <SocialButton className="bg-primary hover:drop-shadow-lg" />
              </Grid>
            </Grid>
          </Box>
        </div>

        <div className="pt-3 2xl:hidden justify-center mt-5 flex flex-col lg:opacity-0 lg:sidebar-expanded:opacity-100 ">
          <button className="bg-primary shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
            <a href="#" className="text-headings my-2 font-heading text-base">
              <LockIcon className="mx-3" />
              Privacy Policy
            </a>
          </button>
          <button className="bg-primary shadow-2xl text-white font-regular py-2 px-4 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
            <a href="#" className="text-headings my-2 font-heading text-base">
              <PanToolOutlinedIcon className="mx-3" />
              Disclaimer
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
