const hre = require("hardhat");

async function main() {
  console.log("DEPLOY SCRIPT STARTED");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy MockUSDC
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  console.log("MockUSDC:", await usdc.getAddress());

  // 2. Deploy BondToken (1000 tokens, 18 decimals)
  const BondToken = await hre.ethers.getContractFactory("BondToken");
  const bondToken = await BondToken.deploy(
    hre.ethers.parseEther("1000")
  );
  await bondToken.waitForDeployment();
  console.log("BondToken:", await bondToken.getAddress());

  // 3. Deploy BondContract
  const interestRate = 7; // 7%
  const maturityDate =
    Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

  const BondContract = await hre.ethers.getContractFactory("BondContract");
  const bond = await BondContract.deploy(
    await usdc.getAddress(),
    await bondToken.getAddress(),
    interestRate,
    maturityDate
  );
  await bond.waitForDeployment();
  console.log("BondContract:", await bond.getAddress());

  // 4. Transfer ALL bond tokens to BondContract
  await (
    await bondToken.transfer(
      await bond.getAddress(),
      hre.ethers.parseEther("1000")
    )
  ).wait();
  console.log("Transferred bond tokens to BondContract");

  // 5.  Transfer issuer role to BondContract (CRITICAL)
  await (
    await bondToken.transferIssuer(await bond.getAddress())
  ).wait();
  console.log("BondContract is now issuer of BondToken");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
