import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Singlebinaryblock from "./Singlebinaryblock";
import { useMarket } from "../../context/market";

const Ongoingtabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { liveQuestions, expiredQuestions } = useMarket();

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Tabs
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      style={{ padding: "10px 0px" }}
    >
      <TabList>
        <Tab>OnGoing</Tab>
        <Tab>Expired</Tab>
      </TabList>
      <TabPanel>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {liveQuestions && liveQuestions.length > 0 ? liveQuestions.map(question => (
            <Singlebinaryblock key={question.id} {...question} />
          )) : (
            <h3 className="text-center">No live questions</h3>
          )}
        </div>
      </TabPanel>
      <TabPanel>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {expiredQuestions && expiredQuestions.length > 0 ? liveQuestions.map(question => (
            <Singlebinaryblock key={question.id} {...question} />
          )) : (
            <h3 className="text-center">No expired questions</h3>
          )}
        </div>
      </TabPanel>
    </Tabs>
  );
}

export default Ongoingtabs;
