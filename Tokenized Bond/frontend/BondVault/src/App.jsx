import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const [account, setAccount] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("5000");
  const [bondBalance, setBondBalance] = useState("0");

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyAmount, setBuyAmount] = useState(1);

  const BOND_PRICE = 100;

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const address = await signer.getAddress();
    setAccount(address);

    const eth = await provider.getBalance(address);
    setEthBalance(ethers.formatEther(eth));
  }

  function buyBond() {
    const totalCost = Number(buyAmount) * BOND_PRICE;

    if (Number(usdcBalance) < totalCost) {
      alert("Not enough USDC");
      return;
    }

    setUsdcBalance((prev) =>
      (Number(prev) - totalCost).toString()
    );

    setBondBalance((prev) =>
      (Number(prev) + Number(buyAmount)).toString()
    );

    setShowBuyModal(false);
  }

  function redeemBond() {
    if (Number(bondBalance) <= 0) {
      alert("No bonds to redeem");
      return;
    }

    const payout = Number(bondBalance) * BOND_PRICE;

    setUsdcBalance((prev) =>
      (Number(prev) + payout).toString()
    );

    setBondBalance("0");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🏦 BondVault</h1>
        <span className="wallet">
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Not Connected"}
        </span>
      </header>

      <div className="dashboard">
        <div className="card">
          <h3>Wallet Address</h3>
          <p>{account || "—"}</p>
        </div>

        <div className="card">
          <h3>ETH Balance</h3>
          <p>{ethBalance} ETH</p>
        </div>

        <div className="card">
          <h3>USDC Balance</h3>
          <p>{usdcBalance} USDC</p>
        </div>

        <div className="card highlight">
          <h3>Bond Tokens (GBOND)</h3>
          <p>{bondBalance} GBOND</p>
        </div>

        <div className="actions">
          <button
            className="primary"
            onClick={() => {
              setBuyAmount(1);
              setShowBuyModal(true);
            }}
          >
            Buy Bonds
          </button>
          <button className="secondary" onClick={redeemBond}>
            Redeem All Bonds
          </button>
        </div>

        <div className="card">
          <h3>Portfolio Overview</h3>
          <p>Total Assets (Demo)</p>
        </div>

        <div className="card">
          <h3>Projected Yield</h3>
          <p>+{bondBalance * 5}% (Estimated)</p>
        </div>

        <div className="card">
          <h3>Network</h3>
          <p>Localhost 8545</p>
        </div>

        <div className="card">
          <h3>Status</h3>
          <p>Demo Mode Active</p>
        </div>
      </div>

      {showBuyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Buy Bonds</h2>
            <p>
              {buyAmount} Bond(s) • Cost: {buyAmount * BOND_PRICE} USDC
            </p>

            <input
              type="range"
              min="1"
              max={Math.floor(usdcBalance / BOND_PRICE)}
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
            />

            <div className="modal-actions">
              <button className="primary" onClick={buyBond}>
                Confirm Purchase
              </button>
              <button
                className="secondary"
                onClick={() => setShowBuyModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
