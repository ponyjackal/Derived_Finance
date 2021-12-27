import React, { Component } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Stakedtable from "./Stakedtable";

export class Stakedtabs extends Component {
  state = {
    selectedIndex: 0,
  };

  handleSelect = (index) => {
    this.setState({ selectedIndex: index });
  };

  handleButtonClick = () => {
    this.setState({ selectedIndex: 0 });
  };

  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };

  handleChange1 = (event) => {
    this.setState({ age1: event.target.value });
  };

  render() {
    return (
      <Tabs
        selectedIndex={this.state.selectedIndex}
        onSelect={this.handleSelect}
      >
        <TabList>
          <Tab>Staked</Tab>
          <Tab>Derived</Tab>
        </TabList>
        <TabPanel>
          <div className="p-4 mx-3 h-16 bg-gradient-to-r from-gradient1 to-gradient2 text-textPrimary flex justify-between items-center rounded-lg">
            <h1 className="text-white text-xl font-bold font-heading">
              Staked Tokens
            </h1>
            <h1 className="text-white text-xl font-bold font-heading">
              $0.0000
            </h1>
          </div>
          <Stakedtable className="w-full"/>
          <div className="flex justify-center md:justify-start"></div>
        </TabPanel>
        <TabPanel>
          <div className="p-4 mx-3 h-16 bg-gradient-to-r from-gradient1 to-gradient2 text-textPrimary flex justify-between items-center rounded-lg">
            <h1 className="text-white text-xl font-bold font-heading">
              Derived Assets
            </h1>
            <h1 className="text-white text-xl font-bold font-heading">
              $0.0000
            </h1>
          </div>
          <Stakedtable/>
          <div className="flex justify-center md:justify-start"></div>
        </TabPanel>
      </Tabs>
    );
  }
}

export default Stakedtabs;
