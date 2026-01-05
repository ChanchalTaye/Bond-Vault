const hre = require("hardhat");

async function main() {
  const [, investor] = await hre.ethers.getSigners();

  // ✅ Deployed BondContract address
  const BOND_CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const bondContract = await hre.ethers.getContractAt(
    "BondContract",
    BOND_CONTRACT_ADDRESS
  );

  // Get BondToken address from BondContract
  const bondTokenAddress = await bondContract.bondToken();
  const bondToken = await hre.ethers.getContractAt(
    "BondToken",
    bondTokenAddress
  );

  // Investor bond balance
  const bondBalance = await bondToken.balanceOf(investor.address);
  console.log("Investor bond balance:", bondBalance.toString());

  // Redeem all bonds
  await (
    await bondContract.connect(investor).redeem(bondBalance)
  ).wait();

  console.log("Bond redeemed successfully (principal + interest paid)");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
