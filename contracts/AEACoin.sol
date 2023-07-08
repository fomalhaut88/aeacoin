// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./Ownable.sol";
import "./ParentRole.sol";
import "./KidRole.sol";


contract AEACoin is ERC20, Ownable, ParentRole, KidRole {
    constructor(string memory name, string memory symbol, 
                uint256 initialSupply) ERC20(name, symbol) {
        _mint(address(this), initialSupply);
    }

    function chargeCoins(uint amount) external parentOnly {
        _transfer(address(this), msg.sender, amount);
    }
}
