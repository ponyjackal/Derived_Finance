import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import Providers from "./Providers";

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <Router>
        <App />
      </Router>
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);
