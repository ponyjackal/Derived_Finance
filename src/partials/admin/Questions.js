/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo } from "react";
import Button from "@mui/material/Button";
// import { Modal } from "react-responsive-modal";
import { Link } from "react-router-dom";
import "react-responsive-modal/styles.css";
import Skeleton from "@mui/material/Skeleton";

import { getJsonIpfs } from "../../utils/Ipfs";
import { toShort18 } from "../../utils/Contract";
import { generateUnixTimestamp, toFriendlyTimeFormat } from "../../utils/Utils";

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Questions = ({ index, questionId, title, status, meta, long, short, submitting, onResolve }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});

  const longPrice = useMemo(() => toShort18(long).toFixed(2), [long]);
  const shortPrice = useMemo(() => toShort18(short).toFixed(2), [short]);

  const canResolve = useMemo(() => {
    if (!details || !details.resolveTime) return false;
    return generateUnixTimestamp(new Date()) >= details.resolveTime;
  }, [details]);

  const resolveTime = useMemo(() => {
    if (!details || !details.resolveTime) return '';
    return toFriendlyTimeFormat(details.resolveTime);
  }, [details]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      const res = await getJsonIpfs(meta);
      setDetails(res);

      setLoading(false);
    };

    meta && initialize();
  }, [meta]);

  return (
    <div>
      {/* Question tab */}
      <Link target="_blank" to={`/Binaryoptionsinside/${questionId}`}>
        <div className=" bg-secondary mx-5 mb-5 rounded-lg cursor-pointer">
          <div className="flex items-center md:flex-row flex-col p-6 w-full">
            <div className="flex md:flex-col flex-col w-64">
              <p className="text-white text-xl p-1">Question {index}</p>
              <p
                className="text-white text-xl p-1 mb-2"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {questionId}
              </p>
              {/* <p className="text-white text-xl p-1">Status : {status}</p> */}
              <p className="text-white text-xl p-1 mb-4 text-center">{resolveTime}</p>
              {status === 'READY' && canResolve && (
                <>
                  <p className="text-white text-xl p-1 text-center">Answer</p>
                  <div className="w-full flex justify-between gap-x-1">
                    <Button
                      className="text-white text-xl font-bold p-2"
                      variant="contained"
                      color="success"
                      disabled={submitting}
                      onClick={() => onResolve(0)}
                    >
                      Yes
                    </Button>
                    <Button
                      className="text-white text-xl font-bold p-2"
                      variant="contained"
                      color="error"
                      disabled={submitting}
                      onClick={() => onResolve(1)}
                    >
                      No
                    </Button>
                  </div>
                </>
              )}
            </div>
            <hr
              className="w-px h-36 bg-gray-200 mx-3"
              style={{ minWidth: "1px" }}
            />
            <div
              className="flex w-full items-start flex-col"
              style={{ width: "calc(100% - 18rem)" }}
            >
              <p
                className="text-white text-3xl font-bold p-2 w-full"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </p>
              {loading ? (
                <Skeleton width={250} height={35} />
              ) : (
                <p
                  className="text-white text-lg p-2"
                  style={{
                    maxHeight: "94px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Description: {details.description}
                </p>
              )}
              <div className="flex justify-between w-full">
                {/* <div className="flex items-center justify-center">
                  <Link
                    target="_blank"
                    to={`/Binaryoptionsinside/${questionId}`}
                    className="text-blue-500 text-xl p-2"
                  >
                    Trade Link
                  </Link>
                </div> */}
                {loading ? (
                  <Skeleton width={150} height={35} />
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-white text-xl font-bold p-2">Source:</p>
                    <a
                      href="https://google.com"
                      target="_blank"
                      className="text-blue-500 text-md p-2 underline"
                      rel="noreferrer"
                    >
                      {details && details.link}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <p className="text-white text-xl font-bold p-2">
                    YES: ${longPrice}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-white text-xl font-bold p-2">
                    NO: ${shortPrice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Questions;
