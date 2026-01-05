// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/*
  BondToken
  - Represents ownership of a bond
  - ERC20-like but minimal
*/

contract BondToken {
    string public name = "Government Bond Token";
    string public symbol = "GBOND";
    uint8 public decimals = 18;

    uint256 public totalSupply;
    address public issuer;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event IssuerTransferred(address indexed oldIssuer, address indexed newIssuer);

    modifier onlyIssuer() {
        require(msg.sender == issuer, "Only issuer");
        _;
    }

    constructor(uint256 _totalSupply) {
        issuer = msg.sender;
        totalSupply = _totalSupply;
        balanceOf[issuer] = _totalSupply;
        emit Transfer(address(0), issuer, _totalSupply);
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Allowance too low");

        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    // 🔥 Burn bonds when redeemed (called by BondContract)
    function burnFrom(address from, uint256 amount) external onlyIssuer {
        require(balanceOf[from] >= amount, "Insufficient balance to burn");

        balanceOf[from] -= amount;
        totalSupply -= amount;

        emit Transfer(from, address(0), amount);
    }

    // 🔁 Transfer issuer role to BondContract
    function transferIssuer(address newIssuer) external onlyIssuer {
        require(newIssuer != address(0), "Invalid issuer");
        address oldIssuer = issuer;
        issuer = newIssuer;
        emit IssuerTransferred(oldIssuer, newIssuer);
    }
}
