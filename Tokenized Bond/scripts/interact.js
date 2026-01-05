const hre = require("hardhat");

async function main() {
  const [, investor] = await hre.ethers.getSigners();

  // ✅ Deployed addresses
  const USDC_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const BOND_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const usdc = await hre.ethers.getContractAt("MockUSDC", USDC_ADDRESS);
  const bondContract = await hre.ethers.getContractAt(
    "BondContract",
    BOND_CONTRACT_ADDRESS
  );

  console.log("Investor:", investor.address);

  // 1️⃣ Mint 1000 USDC to investor
  await (
    await usdc.mint(
      investor.address,
      hre.ethers.parseUnits("1000", 6)
    )
  ).wait();
  console.log("Minted 1000 USDC to investor");

  // 2️⃣ Approve BondContract to spend 500 USDC
  await (
    await usdc
      .connect(investor)
      .approve(
        BOND_CONTRACT_ADDRESS,
        hre.ethers.parseUnits("500", 6)
      )
  ).wait();
  console.log("Investor approved 500 USDC");

  // 3️⃣ Buy bond with 500 USDC
  await (
    await bondContract
      .connect(investor)
      .buyBond(hre.ethers.parseUnits("500", 6))
  ).wait();
  console.log("Investor bought bond successfully");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
