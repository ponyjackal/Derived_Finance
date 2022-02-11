/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

export class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      verbiage:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      text: "",
      inProgress: "In Progress",
      disabled: false,
    };
  }

  onClickButton = (e) => {
    e.preventDefault();
    this.setState({ openModal: true, text: this.state.verbiage });
  };

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  closeModal = () => {
    this.setState({ openModal: false });
    this.setState({ inProgress: "Closed" });
    this.setState({ disabled: true });
  };

  updateModal = () => {
    this.setState({ openModal: false });
    this.setState({ verbiage: this.state.text });
  };
  render() {
    return (
      <div>
        {/* Question tab */}
        <div
          disabled={this.state.disabled}
          className=" bg-secondary mx-5 mb-5 rounded-lg cursor-pointer"
          onClick={this.onClickButton}
        >
          <div className="flex items-center md:flex-row flex-col p-6">
            <div className="flex md:flex-col flex-col w-64">
              <p className="text-white text-xl p-2">Question 1</p>
              <p className="text-white text-xl p-2">Id (0 x 20001)</p>
              <p className="text-white text-xl p-2">
                Status : {this.state.inProgress}
              </p>
            </div>
            <hr className="w-px h-36 bg-gray-200 mx-3" />
            <div className="flex w-full items-start flex-col">
              <p className="text-white text-3xl font-bold p-2">
                Question Explained
              </p>
              <p className="text-white text-lg p-2">
                Verbiage: {this.state.verbiage}
              </p>
              <div className="flex justify-between w-full">
                <div className="flex items-center justify-center">
                  <p className="text-white text-xl font-bold p-2">Source:</p>
                  <a
                    href="https://google.com"
                    target="_blank"
                    className="text-blue-500 text-md p-2 underline" rel="noreferrer"
                  >
                    abcd
                  </a>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-white text-xl font-bold p-2">Result:</p>
                  <a
                    href="https://google.com"
                    target="_blank"
                    className="text-blue-500 text-md p-2 underline" rel="noreferrer"
                  >
                    abcd
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* modal of question */}
        <Modal
          open={this.state.openModal}
          onClose={this.onCloseModal}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal",
          }}
        >
          <div className="flex w-full items-start flex-col">
            <p className="text-white text-xl font-bold p-2 underline">
              Manage Question
            </p>
            <p className="text-white text-lg p-2 pt-0">Edit Verbiage</p>
            <textarea
              value={this.state.text}
              onChange={(e) => this.setState({ text: e.target.value })}
              rows={5}
              className="w-full p-2 bg-primary text-white"
            >
              {this.state.verbiage}
            </textarea>
            <div className="flex justify-between w-full">
              <button className="bg-update shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
                <a
                  className="text-white my-2 p-2 font-heading text-base font-bold"
                  onClick={() => this.updateModal()}
                >
                  Update
                </a>
              </button>
              <button className="bg-cancel shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
                <a
                  className="text-white my-2 p-2 font-heading text-base font-bold"
                  onClick={() => this.closeModal()}
                >
                  Close
                </a>
              </button>
              <button className="bg-primary shadow-2xl text-white font-regular py-2 rounded my-3 font-heading text-sm hover:drop-shadow-lg">
                <a
                  className="text-white my-2 p-2 font-heading text-base font-bold"
                  onClick={this.onCloseModal}
                >
                  Cancel
                </a>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Questions;
