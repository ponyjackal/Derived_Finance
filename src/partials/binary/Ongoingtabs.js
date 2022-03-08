import { useMemo } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import CircularProgress from "@mui/material/CircularProgress";

import Singlebinaryblock from "./Singlebinaryblock";
import { useMarket } from "../../context/market";

const Ongoingtabs = ({ category, sortBy }) => {
  const {
    liveQuestions,
    expiredQuestions,
    loading: loadingMarketData,
  } = useMarket();

  const filterQuestion = (questions) =>
    questions
      .filter((question) => {
        if (!category) return question;
        return question.category === category;
      })
      .sort((quzA, quzB) => {
        if (sortBy === "asc") return +quzA.resolveTime - +quzB.resolveTime;
        return +quzB.resolveTime - +quzA.resolveTime;
      });

  const ongingQuestions = useMemo(
    () => filterQuestion(liveQuestions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [liveQuestions, category, sortBy]
  );

  const resolvedQuestions = useMemo(
    () => filterQuestion(expiredQuestions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expiredQuestions, category, sortBy]
  );

  return (
    <Tabs style={{ padding: "10px 0px" }}>
      <TabList>
        <Tab>OnGoing</Tab>
        <Tab>Expired</Tab>
      </TabList>
      <TabPanel>
        {loadingMarketData ? (
          <div className="justify-center flex">
            <CircularProgress />
          </div>
        ) : (
          <>
            {ongingQuestions && ongingQuestions.length > 0 ? (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {ongingQuestions.map((question) => (
                  <Singlebinaryblock key={question.id} {...question} />
                ))}
              </div>
            ) : (
              <h3 className="text-center">No live questions</h3>
            )}
          </>
        )}
      </TabPanel>
      <TabPanel>
        {loadingMarketData ? (
          <div className="justify-center flex">
            <CircularProgress />
          </div>
        ) : (
          <>
            {resolvedQuestions && resolvedQuestions.length > 0 ? (
              <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
                {resolvedQuestions.map((question) => (
                  <Singlebinaryblock key={question.id} {...question} />
                ))}
              </div>
            ) : (
              <h3 className="text-center">No expired questions</h3>
            )}
          </>
        )}
      </TabPanel>
    </Tabs>
  );
};

export default Ongoingtabs;
