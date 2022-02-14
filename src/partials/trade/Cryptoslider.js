import React, { useState, useEffect } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "../../css/owl.css";
import Singlecarouselitem from "./Singlecarouselitem";
import { AVAILALBE_TOKENS } from "../../utils/Tokens";
import { getPrices } from "../../services/coingecko";

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

const Cryptoslider = () => {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchPrice = async () => {
      const ids = AVAILALBE_TOKENS.map(token => token.coinId).join(',');

      try {
        const res = await getPrices(ids, true);
        const tokenPrices = [];
        for (const token of AVAILALBE_TOKENS) {
          tokenPrices.push({
            ...token,
            price: res[token.coinId].usd,
            change: parseFloat(res[token.coinId].usd_24h_change).toFixed(2),
          });
        }
        setTokens(tokenPrices);
      } catch (error) {
        console.error("Fetching Price error: ", error.message);
      }
    };

    fetchPrice();
  }, []);

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
          {tokens.map((token) => (
            <Singlecarouselitem
              key={token.key}
              token={token}
            />
          ))}
        </OwlCarousel>
      </div>
    </div>
  );
};

export default Cryptoslider;
