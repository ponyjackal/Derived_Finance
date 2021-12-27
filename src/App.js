import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import "./css/style.scss";
import { focusHandling } from "cruip-js-toolkit";
import "./charts/ChartjsConfig";
// Import pages
import Dashboard from "./pages/Dashboard";
import Trade from "./pages/Trade";
import Stake from "./pages/Stake";
import Binary from "./pages/Binary";
import Binaryoptionsinside from "./pages/Binaryoptionsinside";
import Farming from "./pages/Farming";
import "./App.css"
import "./css/react-tabs.css"

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
    focusHandling("outline");
  }, [location.pathname]); // triggered on route change

  return (
    <>
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
        <Route exact path="/Binary">
          <Binary />
        </Route>
        <Route exact path="/Farming">
          <Farming />
        </Route>
        <Route exact path="/Binaryoptionsinside">
          <Binaryoptionsinside />
        </Route>
      </Switch>
    </>
  );
}

export default App;
