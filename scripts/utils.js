const fs = require("fs");

const writeToJson = (chainId, content) => {
  const dir = `${__dirname}/address`;

  try {
    const json = JSON.stringify(content, null, 2);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFileSync(`${dir}/${chainId}.json`, json);

    console.log("Done");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  writeToJson
};
