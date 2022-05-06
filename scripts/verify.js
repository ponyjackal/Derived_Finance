const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const chainId = (await hre.waffle.provider.getNetwork()).chainId;
  const dir = `${__dirname}/address`;

  const json = fs.readFileSync(`${dir}/${chainId}.json`);
  const data = JSON.parse(json);

  for (const contract of data) {
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments: contract.args
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
