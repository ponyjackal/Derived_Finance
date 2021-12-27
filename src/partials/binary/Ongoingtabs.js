import React, { Component } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Singlebinaryblock from "./Singlebinaryblock";

export class Ongoingtabs extends Component {
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
        style={{ padding: "10px 0px" }}
      >
        <TabList>
          <Tab>OnGoing</Tab>
          <Tab>Expired</Tab>
        </TabList>
        <TabPanel>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
            <Singlebinaryblock />
          </div>
        </TabPanel>
      </Tabs>
    );
  }
}

export default Ongoingtabs;
