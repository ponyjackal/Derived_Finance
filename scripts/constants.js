/**
 * @note Thegraph: https://thegraph.com/hosted-service/subgraph/rango-finance/pancakeswap_pairs
 * 
 * @dev The DVDX pair contract address query
 * {
      pairs(where: {
        token0: "0x4b4135a99775368f349b6f904808b648a9948393"
      }) {
        id
        token0 {
          id
          name
          symbol
          decimals
        }
        token1 {
          id
          name
          symbol
          decimals
        }
      }
    }
 *
 */

export const DVDX_BUSD_PAIRS = {
  56: "0xb5353Cc3a93bcC2E9Bc771Cc9D5A4a82186d4671",
  97: ""
};

export const DVDX_USDT_PAIRS = {
  56: "0x1cbe4b766aab4132ee9720430303baeac6b6a393",
  97: ""
};

export const DVDX_WBNB_PAIRS = {
  56: "0x694f0b5526560e00645b85b1f9203bdd65611503",
  97: ""
};
