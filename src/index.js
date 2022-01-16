import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";

import App from "./App";
import Providers from "./Providers";

ReactDOM.render(
  <Providers>
    <Router>
      <App />
    </Router>
  </Providers>,
  document.getElementById("root")
);
