import React, { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
// import TextareaAutosize from "@mui/material/TextareaAutosize";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DateTimePicker from "@mui/lab/DateTimePicker";

import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "bignumber.js";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Questions from "../partials/admin/Questions";

import { useChain } from "../context/chain";
import { useMarket } from "../context/market";
import { useDisclaimer } from "../context/disclaimer";
import { deployToIPFS } from "../utils/Ipfs";
import { toLong18 } from "../utils/Contract";
import { generateUnixTimestamp } from "../utils/Utils";
import { AVAILALBE_TOKENS } from "../utils/Tokens";

function Stake() {
  const { MarketContract, USDXContract } = useChain();
  const { loading, liveQuestions, expiredQuestions, addLiveQuestion } =
    useMarket();
  const { showError } = useDisclaimer();
  const { account } = useWeb3React();

  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState({});

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const requiredFields = [
    "title",
    "description",
    "link",
    "type",
    "resolver",
    "resolveTime",
    "funding",
    "fee",
  ];
  const coinFields = ["coinId", "coinStrikePrice"];

  const isValidated = (value, fields) => {
    return fields.reduce((v, field) => !!value[field] || v, true);
  };

  const handleChange = (event) => {
    setQuestion((val) => ({
      ...val,
      [event.target.name]: event.target.value,
    }));
  };

  const onHandleSubmit = async () => {
    setSubmitting(true);

    try {
      if (!isValidated(question, requiredFields)) return;

      if (question.type === "crypto") {
        if (!isValidated(question, coinFields)) return;
      }

      const amount = toLong18(question.funding);
      const allowance = await USDXContract.allowance(
        account,
        MarketContract.address
      );
      const allowBN = new BigNumber(allowance.toString());
      if (amount.gt(allowBN)) {
        const approve = await USDXContract.approve(
          MarketContract.address,
          amount.toFixed()
        );
        await approve.wait();
      }

      const resolveTime = generateUnixTimestamp(question.resolveTime);
      const ipfs = await deployToIPFS({
        ...question,
        funding: amount.toFixed(),
        resolveTime,
      });

      const tx = await MarketContract.createQuestion(
        question.resolver,
        question.title,
        ipfs,
        question.type,
        resolveTime,
        amount.toFixed(),
        question.fee
      );

      await tx.wait();

      const questionId = await MarketContract.generateQuestionId(account, ipfs);

      addLiveQuestion({
        ...question,
        category: question.type,
        questionId: new BigNumber(questionId.toString()).toFixed(),
        funding: amount.toFixed(),
        meta: ipfs,
        resolveTime,
      });

      onCloseModal();

      setQuestion({});
    } catch (error) {
      showError(error.message);
      console.error("Submit error: ", error.message);
    }

    setSubmitting(false);
  };

  const onHandleResolve = async (questionId, answerIndex) => {
    setSubmitting(true);

    try {
      const tx = await MarketContract.resolveQuestion(
        questionId,
        answerIndex
      );

      await tx.wait();
    } catch (error) {
      console.error('Resolve question error: ', error.message);
      showError(error.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="px-4 sm:px-6 lg:px-8 py-4 m-5 bg-secondary rounded-lg flex md:flex-row flex-col items-center justify-between">
          <p className="text-white text-2xl font-bold">Questions</p>
          <button
            className="bg-white shadow-2xl text-primary font-regular p-2 rounded my-3 font-bold text-sm hover:drop-shadow-lg"
            onClick={onOpenModal}
          >
            Add Question
          </button>
          <Modal
            open={open}
            onClose={onCloseModal}
            center
            classNames={{
              overlay: "customOverlay",
              modal: "customModal",
            }}
          >
            <div className="flex w-full items-start flex-col">
              <p className="text-white text-xl font-bold p-2 underline">
                Add A Question
              </p>
              <div className="pt-4 w-full">
                <p className="text-white text-lg p-2 pt-0">Enter Title</p>
                <TextField
                  id="question-title"
                  variant="outlined"
                  className="w-full"
                  required
                  name="title"
                  value={question.title}
                  onChange={handleChange}
                />
                {/* <TextareaAutosize
                  name="title"
                  value={question.title}
                  onChange={handleChange}
                  aria-label="minimum height"
                  minRows={1}
                  placeholder="Title Goes Here"
                  className="w-full p-2 bg-primary text-white"
                /> */}
              </div>
              <div className="pt-4 w-full">
                <p className="text-white text-lg p-2 pt-0">Enter Description</p>
                <TextField
                  id="question-description"
                  variant="outlined"
                  multiline
                  rows={5}
                  className="w-full"
                  required
                  name="description"
                  value={question.description}
                  onChange={handleChange}
                />
                {/* <TextareaAutosize
                  name="description"
                  value={question.description}
                  onChange={handleChange}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Description Goes Here"
                  className="w-full p-2 bg-primary text-white"
                /> */}
              </div>
              <div className="grid grid-cols-2 w-full">
                <div>
                  <div className="pt-4 pr-2 w-full">
                    <p className="text-white text-lg p-2 pt-0">Enter Link</p>
                    <TextField
                      id="question-link"
                      variant="outlined"
                      className="w-full"
                      required
                      name="link"
                      value={question.link}
                      onChange={handleChange}
                    />
                    {/* <TextareaAutosize
                      name="link"
                      value={question.link}
                      onChange={handleChange}
                      aria-label="minimum height"
                      minRows={1}
                      placeholder="Link Goes Here"
                      className="w-full p-2 bg-primary text-white"
                    /> */}
                  </div>
                </div>
                <div>
                  <div className="pt-4 pl-2 w-full">
                    <p className="text-white text-lg p-2 pt-0">Enter Type</p>
                    <Select
                      name="type"
                      required
                      value={question.type}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                    >
                      <MenuItem value="crypto">Crypto</MenuItem>
                      <MenuItem value="life">Life</MenuItem>
                    </Select>
                    {/* <TextareaAutosize
                      name="type"
                      value={question.type}
                      onChange={handleChange}
                      aria-label="minimum height"
                      minRows={1}
                      placeholder="Type Goes Here"
                      className="w-full p-2 bg-primary text-white"
                    /> */}
                  </div>
                </div>
              </div>
              {question.type === "crypto" && (
                <div className="grid grid-cols-2 w-full">
                  <div>
                    <div className="pt-4 pr-2 w-full">
                      <p className="text-white text-lg p-2 pt-0">
                        Enter CoinId
                      </p>
                      <Select
                        name="coinId"
                        required
                        value={question.coinId}
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      >
                        {AVAILALBE_TOKENS.map((token) => (
                          <MenuItem key={token.key} value={token.coinId}>
                            {token.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {/* <TextareaAutosize
                        name="coinId"
                        value={question.coinId}
                        onChange={handleChange}
                        aria-label="minimum height"
                        minRows={1}
                        placeholder="CoinId Goes Here"
                        className="w-full p-2 bg-primary text-white"
                      /> */}
                    </div>
                  </div>
                  <div>
                    <div className="pt-4 pl-2 w-full">
                      <p className="text-white text-lg p-2 pt-0">
                        Enter CoinStrikePrice
                      </p>
                      <TextField
                        id="question-strike"
                        variant="outlined"
                        className="w-full"
                        required
                        name="coinStrikePrice"
                        value={question.coinStrikePrice}
                        onChange={handleChange}
                      />
                      {/* <TextareaAutosize
                        name="coinStrikePrice"
                        value={question.coinStrikePrice}
                        onChange={handleChange}
                        aria-label="minimum height"
                        minRows={1}
                        placeholder="CoinStrikePrice Goes Here"
                        className="w-full p-2 bg-primary text-white"
                      /> */}
                    </div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 w-full">
                <div>
                  <div className="pt-4 pr-2 w-full">
                    <p className="text-white text-lg p-2 pt-0">
                      Enter Resolver
                    </p>
                    <TextField
                      id="question-resolver"
                      variant="outlined"
                      className="w-full"
                      required
                      name="resolver"
                      value={question.resolver}
                      onChange={handleChange}
                    />
                    {/* <TextareaAutosize
                      name="resolver"
                      value={question.resolver}
                      onChange={handleChange}
                      aria-label="minimum height"
                      minRows={1}
                      placeholder="Resolver Goes Here"
                      className="w-full p-2 bg-primary text-white"
                    /> */}
                  </div>
                </div>
                <div>
                  <div className="pt-4 pl-2 w-full">
                    <p className="text-white text-lg p-2 pt-0">
                      Enter ResolveTime
                    </p>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      value={question.resolveTime}
                      onChange={(newValue) => {
                        setQuestion((v) => ({ ...v, resolveTime: newValue }));
                      }}
                    />
                    {/* <TextField
                      id="question-resolve"
                      variant="outlined"
                      className="w-full"
                      required
                      name="resolveTime"
                      inputFormat="MM/dd/yyyy"
                      value={question.resolveTime}
                      onChange={handleChange}
                    /> */}
                    {/* <TextareaAutosize
                      name="resolveTime"
                      value={question.resolveTime}
                      onChange={handleChange}
                      aria-label="minimum height"
                      minRows={1}
                      placeholder="ResolveTime Goes Here"
                      className="w-full p-2 bg-primary text-white"
                    /> */}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 w-full">
                <div>
                  <div className="pt-4 pr-2 w-full">
                    <p className="text-white text-lg p-2 pt-0">Enter Funding</p>
                    <TextField
                      id="question-funding"
                      variant="outlined"
                      className="w-full"
                      required
                      name="funding"
                      value={question.funding}
                      onChange={handleChange}
                    />
                    {/* <TextareaAutosize
                      name="funding"
                      value={question.funding}
                      onChange={handleChange}
                      aria-label="minimum height"
                      minRows={1}
                      placeholder="Funding Goes Here"
                      className="w-full p-2 bg-primary text-white"
                    /> */}
                  </div>
                </div>
                <div>
                  <div className="pt-4 pl-2 w-full">
                    <p className="text-white text-lg p-2 pt-0">Enter Fee</p>
                    <TextField
                      id="question-fee"
                      variant="outlined"
                      className="w-full"
                      required
                      name="fee"
                      value={question.fee}
                      onChange={handleChange}
                    />
                    {/* <TextareaAutosize
                      name="fee"
                      value={question.fee}
                      onChange={handleChange}
                      aria-label="minimum height"
                      minRows={1}
                      placeholder="Fee Goes Here"
                      className="w-full p-2 bg-primary text-white"
                    /> */}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center mt-4">
                <Button
                  variant="contained"
                  disabled={submitting}
                  className="bg-white shadow-2xl text-primary font-regular p-2 rounded my-3 font-bold text-sm hover:drop-shadow-lg"
                  onClick={onHandleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Modal>
        </div>
        {loading ? (
          <div className="w-full flex justify-center pt-5">Loading...</div>
        ) : (
          <div className="w-full">
            <Tabs style={{ padding: "10px 0px" }}>
              <TabList>
                <Tab>OnGoing</Tab>
                <Tab>Expired</Tab>
              </TabList>
              <TabPanel>
                {liveQuestions &&
                  liveQuestions.map((quz, index) => (
                    <Questions
                      {...quz}
                      key={quz.id}
                      index={index + 1}
                      submitting={submitting}
                      onResolve={(answerIndex) =>
                        onHandleResolve(quz.questionId, answerIndex)
                      }
                    />
                  ))}
              </TabPanel>
              <TabPanel>
                {expiredQuestions &&
                  expiredQuestions.map((quz, index) => (
                    <Questions key={quz.id} index={index + 1} {...quz} />
                  ))}
              </TabPanel>
            </Tabs>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default Stake;
