const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  //METAMASK ADDRESS HERE
  const METAMASK_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const usdc = await hre.ethers.getContractAt("MockUSDC", USDC_ADDRESS);

  console.log("Minting USDC to:", METAMASK_ADDRESS);

  await (
    await usdc.mint(
      METAMASK_ADDRESS,
      hre.ethers.parseUnits("5000", 6)
    )
  ).wait();

  console.log("✅ Minted 5000 USDC to MetaMask");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
