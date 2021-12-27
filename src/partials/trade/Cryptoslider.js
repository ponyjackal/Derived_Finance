import React, { Component } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "../../css/owl.css";
import Singlecarouselitem from "./Singlecarouselitem";

const options = {
  margin: 10,
  responsiveClass: true,
  // nav: true,
  dots: true,
  autoplay: true,
  smartSpeed: 1000,
  loop: true,
  responsive: {
    0: {
      items: 1,
    },
    400: {
      items: 1,
    },
    600: {
      items: 2,
    },
    700: {
      items: 3,
    },
    1000: {
      items: 5,
    },
  },
};

export class Cryptoslider extends Component {
  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row title">
            <div className="col-sm-12 my-5 text-white text- xl">
              <SearchOutlinedIcon /> Compare To
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <OwlCarousel {...options}>
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
            <Singlecarouselitem />
          </OwlCarousel>
        </div>
      </div>
    );
  }
}

export default Cryptoslider;
