import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Transition from "../../utils/Transition";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

function Notifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative inline-flex mr-3">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-full ${
          dropdownOpen && "bg-gray-200"
        }`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Notifications</span>

        <NotificationsNoneOutlinedIcon
          className="bg-headings mx-10 p-2 rounded-lg text-white"
          style={{ height: "40px", width: "40px" }}
        />
        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></div>
      </button>

      <Transition
        className="origin-top-right z-10 absolute top-full right-0 -mr-48 sm:mr-0 min-w-80 bg-secondary border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-gray-400 uppercase pt-1.5 pb-2 px-4 border-gray-200 ">
            Notifications
          </div>
          <ul>
            <li className="border-b border-gray-200 last:border-0">
              <Link
                className="block py-2 px-4"
                to="#0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="block text-sm mb-2">
                  📣{" "}
                  <span className="font-medium text-gray-100">
                    Edit your information in a swipe
                  </span>
                  <br />
                  <p className="font-medium text-white">
                    Sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim.
                  </p>
                </span>
                <span className="block text-xs font-medium text-gray-400">
                  Feb 12, 2021
                </span>
              </Link>
            </li>
            <li className="border-b border-gray-200 last:border-0">
              <Link
                className="block py-2 px-4"
                to="#0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="block text-sm mb-2">
                  📣{" "}
                  <span className="font-medium text-gray-100">
                    Edit your information in a swipe
                  </span>
                  <br />
                  <p className="font-medium text-white">
                    Sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim.
                  </p>
                </span>
                <span className="block text-xs font-medium text-gray-400">
                  Feb 12, 2021
                </span>
              </Link>
            </li>
            <li className="border-b border-gray-200 last:border-0">
              <Link
                className="block py-2 px-4"
                to="#0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="block text-sm mb-2">
                  📣{" "}
                  <span className="font-medium text-gray-100">
                    Edit your information in a swipe
                  </span>
                  <br />
                  <p className="font-medium text-white">
                    Sint occaecat cupidatat non proident, sunt in culpa qui
                    officia deserunt mollit anim.
                  </p>
                </span>
                <span className="block text-xs font-medium text-gray-400">
                  Feb 12, 2021
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default Notifications;
