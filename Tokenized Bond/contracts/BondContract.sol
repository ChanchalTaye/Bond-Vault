// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./BondToken.sol";
import "./MockUSDC.sol";

contract BondContract {
    MockUSDC public usdc;
    BondToken public bondToken;

    uint256 public interestRate; // e.g. 7 = 7%
    uint256 public maturityDate;

    constructor(
        address _usdc,
        address _bondToken,
        uint256 _interestRate,
        uint256 _maturityDate
    ) {
        usdc = MockUSDC(_usdc);
        bondToken = BondToken(_bondToken);
        interestRate = _interestRate;
        maturityDate = _maturityDate;
    }

    // Buy bonds using USDC
    function buyBond(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Invalid amount");

        // Transfer USDC from investor to this contract
        usdc.transferFrom(msg.sender, address(this), usdcAmount);

        // Convert USDC (6 decimals) to BondToken (18 decimals)
        uint256 bondAmount = usdcAmount * 1e12;

        // Send bond tokens to investor
        bondToken.transfer(msg.sender, bondAmount);
    }

    //   Redeem bonds after maturity
    function redeem(uint256 bondAmount) external {
        require(block.timestamp >= maturityDate, "Bond not matured");
        require(bondAmount > 0, "Invalid amount");

        // Burn investor's bond tokens
        bondToken.burnFrom(msg.sender, bondAmount);

        // Convert bond tokens back to USDC principal
        uint256 principal = bondAmount / 1e12;

        // Calculate interest
        uint256 interest = (principal * interestRate) / 100;

        uint256 payout = principal + interest;

        // Pay investor in USDC
        usdc.transfer(msg.sender, payout);
    }
}
