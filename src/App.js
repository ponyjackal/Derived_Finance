import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import { focusHandling } from "cruip-js-toolkit";

// Import pages
import Dashboard from "./pages/Dashboard";
import Trade from "./pages/Trade";
import Stake from "./pages/Stake";
import Binary from "./pages/Binary";
import Exchange from "./pages/Exchange";
// import Farming from "./pages/Farming";
import Binaryoptionsinside from "./pages/Binaryoptionsinside";

import "./App.css";
import "./css/style.scss";
import "./css/react-tabs.css";
import "./charts/ChartjsConfig";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
    focusHandling("outline");
  }, [location.pathname]);

  return (
    <Switch>
      <Route exact path="/">
        <Dashboard />
      </Route>
      <Route exact path="/Trade">
        <Trade />
      </Route>
      <Route exact path="/Stake">
        <Stake />
      </Route>
      <Route exact path="/Exchange">
        <Exchange />
      </Route>
      <Route exact path="/Binary">
        <Binary />
      </Route>
      {/* Disable Farming/LP page */}
      {/* <Route exact path="/Farming">
        <Farming />
      </Route> */}
      <Route exact path="/Binaryoptionsinside/:questionId">
        <Binaryoptionsinside />
      </Route>
    </Switch>
  );
}

export default App;
