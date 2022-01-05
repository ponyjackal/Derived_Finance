import React from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";

import Progressbar from "./Progressbar";
import image from "../../images/user-36-05.jpg";
import { toShortAddress } from "../../utils/Utils";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Singlebinaryblock = ({ title, questionId }) => {
  return (
    <div className="p-2 bg-secondary rounded-lg">
      <div className="flex items-center justify-between">
        <Link to="/Binaryoptionsinside" className="flex items-center justify-between">
          <img src={image} className="rounded-full w-12 p-1" alt="" />
          <p className="text-white text-sm">
            {title}
          </p>
        </Link>
        <Checkbox
          {...label}
          icon={<StarBorderIcon />}
          checkedIcon={<StarBorderIcon />}
          color="warning"
        />{" "}
      </div>
      <Link to="/Binaryoptionsinside">
        <div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Binary Option ID</p>
            <p className="text-white">{toShortAddress(questionId || '', 8)}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Time Remaining</p>
            <p className="text-white">20:01:01:01</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Expiry Date</p>
            <p className="text-white">Nov 30, 21 | 00:30</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Strike Price</p>
            <p className="text-white">300$</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Current Asset Price</p>
            <p className="text-white">238$</p>
          </div>
        </div>
      </Link>
      <Link to="/Binaryoptionsinside">
        <Progressbar
          bgcolor="#86C440"
          progress="50"
          height={15}
          className="text-white"
        />
      </Link>
    </div>
  );
}

export default Singlebinaryblock;
