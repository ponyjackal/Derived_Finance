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
        {liveQuestions && liveQuestions.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {liveQuestions.map(question => (
              <Singlebinaryblock key={question.id} {...question} />
            ))}
          </div>
        ) : (
          <h3 className="text-center">No live questions</h3>
        )}
      </TabPanel>
      <TabPanel>
        {expiredQuestions && expiredQuestions.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            {liveQuestions.map(question => (
              <Singlebinaryblock key={question.id} {...question} />
            ))}
          </div>
        ) : (
          <h3 className="text-center">No expired questions</h3>
        )}
      </TabPanel>
    </Tabs>
  );
}

export default Ongoingtabs;
