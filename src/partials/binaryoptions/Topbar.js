import React, { Component } from "react";
import image from "../../images/user-36-05.jpg";
import Valueblockstwo from "../binary/Valueblockstwo";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export class Topbar extends Component {
  render() {
    return (
      <div>
        <div className=" bg-secondary mx-10 rounded-lg">
          <div className="flex items-center md:flex-row flex-col p-6">
            <div className="flex items-center md:flex-row flex-col">
              <img src={image} className="rounded-full w-24 p-1" alt=""/>
              <div>
                <p className="text-gray-500 text-lg font-light">POP Culture</p>
                <p className="text-white text-2xl font-bold">
                  Will ‘House of Gucci’ get 86% or higher Audience Score on
                  Rotten Tomatoes?
                </p>
              </div>
            </div>
            <div className="flex w-full items-center justify-center">
              <Valueblockstwo />
            </div>
          </div>
          <div className="flex items-center md:flex-row flex-col p-8 pt-0">
            <Button
              variant="contained"
              style={{
                backgroundColor: "transparent",
                padding: "0 10px",
                border: "1px solid black",
              }}
            >
              <div className="flex items-center">
                <Checkbox
                  {...label}
                  icon={<StarBorderIcon />}
                  checkedIcon={<StarBorderIcon />}
                  color="warning"
                />{" "}
                <p className="text-white text-sm normal-case mt-1">Favourite</p>
              </div>
            </Button>
            <div className="flex md:flex-row flex-col py-2 text-center">
              <p className="text-white text-sm mx-2">
                Developed By : <span className="text-headings">0x790A...949B</span>
              </p>
              <p className="text-white text-sm">
                Resolver : <span className="text-headings">0x790A...949B</span>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

export default Topbar;
