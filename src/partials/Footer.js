import React, { Component } from "react";

export class Footer extends Component {
  getYear() {
    return new Date().getFullYear();
  }

  render() {
    return (
      <div className="w-full bg-primary flex justify-center">
        <p className="text-headings font-body font-extrabold">
          Copyright &copy; {this.getYear()}{" "}
          <a href="https://webixun.com" target="_blank">
            Webixun Infoways Pvt. Ltd.
          </a>
          . All Rights Reserved
        </p>
      </div>
    );
  }
}

export default Footer;
