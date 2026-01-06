const hre = require("hardhat");

async function main() {
  console.log("DEPLOY SCRIPT STARTED");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1️⃣ Deploy MockUSDC
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  console.log("MockUSDC:", await usdc.getAddress());

  // 2️⃣ Deploy BondToken (NO initial supply)
  const BondToken = await hre.ethers.getContractFactory("BondToken");
  const bondToken = await BondToken.deploy();
  await bondToken.waitForDeployment();
  console.log("BondToken:", await bondToken.getAddress());

  // 3️⃣ Deploy BondContract
  const interestRate = 7; // 7%
  const maturityDate =
    Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  const BondContract = await hre.ethers.getContractFactory("BondContract");
  const bondContract = await BondContract.deploy(
    await usdc.getAddress(),
    await bondToken.getAddress(),
    interestRate,
    maturityDate
  );
  await bondContract.waitForDeployment();
  console.log("BondContract:", await bondContract.getAddress());

  // 4️⃣ Transfer issuer role to BondContract (REQUIRED)
  await (
    await bondToken.transferIssuer(await bondContract.getAddress())
  ).wait();
  console.log("BondContract is now issuer of BondToken");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
