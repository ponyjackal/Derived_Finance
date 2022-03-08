import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfigFile from "../css/tailwind.config";

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig(tailwindConfigFile);
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

/**
 * Convert to short address
 * @param {String} str
 * @returns {String}
 */
export const toShortAddress = (str = "", num = 3) => {
  return `${str.substring(0, num)}...${str.substring(
    str.length - num,
    str.length
  )}`;
};

export const toHexString = (num) => {
  return `0x${num.toString(16)}`;
};

export const toFriendlyTimeFormat = (time) => {
  const d = new Date(time * 1000);
  const day = dayjs(d).format("MMM DD, YY | hh:mm");

  return day;
};

export const toFriendlyTime = (time) => {
  const d = new Date(time * 1000);
  const day = dayjs(d).format("MMM DD, YYYY");

  return day;
};

export const toTimer = (time) => {
  const dividers = [1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000];

  let str = "",
    res = time;
  for (const divier of dividers) {
    const r = res % divier;
    const t = (res - r) / divier;

    if (t !== 0) {
      str += `${t > 9 ? t : "0" + t}:`;
    } else {
      str += `00:`;
    }

    res = r;
  }

  if (str.length > 0) {
    return str.slice(0, str.length - 1);
  }

  return "00:00:00:00";
};

export const smaller = (num1, num2) => {
  return new BigNumber(num1).lt(new BigNumber(num2)) ? num1 : num2;
};

export const generateUnixTimestamp = (time) => {
  return new Date(time).getTime() / 1000;
};
