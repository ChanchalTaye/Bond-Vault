import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACTS } from "./contracts";

// Minimal ERC20 ABI (read-only)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

function App() {
  const [account, setAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [bondBalance, setBondBalance] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  // Auto-detect connected wallet
  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
      if (accounts.length > 0) setAccount(accounts[0]);
    });
  }, []);

  // ETH balance
  useEffect(() => {
    if (!account) return;

    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [account, "latest"],
      })
      .then((bal) => {
        setEthBalance(parseInt(bal, 16) / 1e18);
      });
  }, [account]);

  // USDC balance
  useEffect(() => {
    if (!account) return;

    const loadUSDC = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const usdc = new ethers.Contract(
        CONTRACTS.USDC,
        ERC20_ABI,
        provider
      );

      const decimals = await usdc.decimals();
      const bal = await usdc.balanceOf(account);

      setUsdcBalance(Number(ethers.formatUnits(bal, decimals)));
    };

    loadUSDC();
  }, [account]);

  // BondToken balance
  useEffect(() => {
    if (!account) return;

    const loadBondToken = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const bondToken = new ethers.Contract(
        CONTRACTS.BOND_TOKEN,
        ERC20_ABI,
        provider
      );

      const decimals = await bondToken.decimals();
      const bal = await bondToken.balanceOf(account);

      setBondBalance(Number(ethers.formatUnits(bal, decimals)));
    };

    loadBondToken();
  }, [account]);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>BondVault</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Wallet Address</strong></p>
          <p>{account}</p>

          <p><strong>ETH Balance</strong></p>
          <p>{ethBalance?.toFixed(4)} ETH</p>

          <p><strong>USDC Balance</strong></p>
          <p>{usdcBalance} USDC</p>

          <p><strong>Bond Tokens (GBOND)</strong></p>
          <p>{bondBalance} GBOND</p>
        </>
      )}
    </div>
  );
}

export default App;
