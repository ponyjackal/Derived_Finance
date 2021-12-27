import React from "react";

export default function Progressbar({ bgcolor, progress, height }) {
  const Parentdiv = {
    height: height,
    width: "90%",
    backgroundColor: "red",
    borderRadius: 40,
    margin: 15,
    position: "relative",
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: bgcolor,
    borderRadius: 40,
    textAlign: "right",
    position: "absolute",
  };

  const progresstext = {
    color: "black",
    fontWeight: 900,
    fontSize: "12px",
    position: "absolute",
    marginTop: "-1px",
  };
  return (
    <div className="flex justify-center">
      <div style={Parentdiv}>
        <div style={Childdiv}>
          <span style={progresstext}>{`${progress}%`}</span>
        </div>
      </div>
    </div>
  );
}
