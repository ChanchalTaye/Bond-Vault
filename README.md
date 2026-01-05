# 🏦 BondVault – Tokenized Government Bond (RWA) Application

A modern **full-stack Web3 Real World Asset (RWA) application** that enables **tokenized government bonds** using **Solidity smart contracts** on the backend and a **React (Vite)** frontend integrated with **MetaMask**.

BondVault allows users to **buy fractional bonds using a stablecoin (USDC)**, earn **fixed interest**, and **securely redeem their bonds after maturity**, all on a local blockchain for demonstration and hackathon purposes.

---

## 🚀 Features

### 🔹 1. Tokenized Government Bonds (RWA)
- Government bonds represented as **ERC20-like tokens (GBOND)**
- Each bond token represents fractional ownership
- Fully on-chain issuance and tracking

### 🔹 2. Fractional Bond Purchase with Stablecoin
- Uses **MockUSDC** (6 decimals) as payment currency
- Investors can buy bonds with any amount (fractional purchase)
- Automatic conversion between USDC and bond tokens

### 🔹 3. Time-Locked Bond Maturity
- Bonds have a **fixed maturity timestamp**
- Redemption only allowed **after maturity**
- Blockchain-enforced time lock (no manual intervention)

### 🔹 4. Interest Calculation & Payout
- Fixed interest rate (e.g. 7%)
- Interest calculated on-chain
- Payout includes **principal + interest**

### 🔹 5. Secure Redemption & Token Burn
- Bond tokens are **burned on redemption**
- Prevents double claims
- Ensures correct supply accounting

---

## 🖥️ Frontend (React + Vite)

### 🔹 Features
- Clean dashboard-style UI
- Displays:
  - Wallet address
  - ETH balance
  - USDC balance
  - Bond token (GBOND) balance
- One-click wallet connection using **MetaMask**

### 🔹 Tech
- **React** with **Vite** for fast builds
- **ethers.js** for blockchain interaction
- Reads live data directly from smart contracts
- Localhost blockchain support (Hardhat)

---

## ⚙️ Backend (Blockchain / Smart Contracts)

### 🔹 Smart Contracts
- **BondToken.sol** – ERC20-like bond token
- **MockUSDC.sol** – Stablecoin for payments
- **BondContract.sol** – Core bond logic

### 🔹 Core Responsibilities
- Bond issuance
- Stablecoin transfers
- Interest calculation
- Time-based maturity enforcement
- Secure redemption

> ⚠️ No traditional backend server is required  
> Blockchain itself acts as the backend

---

## 🧠 How BondVault Works

1. Issuer deploys smart contracts
2. Bond tokens are minted and assigned to BondContract
3. Investor connects wallet via MetaMask
4. Investor buys bonds using USDC
5. Bond tokens are transferred to investor
6. Blockchain time advances to maturity
7. Investor redeems bonds
8. Principal + interest is paid in USDC
9. Bond tokens are burned

---

## 🛠️ Tech Stack

| Layer | Tools |
|-----|------|
| **Smart Contracts** | Solidity |
| **Blockchain Dev** | Hardhat |
| **Frontend** | React, Vite |
| **Web3 Library** | ethers.js |
| **Wallet** | MetaMask |
| **Network** | Hardhat Localhost |
| **Version Control** | Git, GitHub |

---

## 🧪 Local Development Setup

### 1️⃣ Start Local Blockchain
```bash
npx hardhat node
