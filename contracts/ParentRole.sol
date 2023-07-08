// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Ownable.sol";


contract ParentRole is Ownable {
    mapping (address => bool) public parents;

    modifier parentOnly() {
        require(parents[msg.sender]);
        _;
    }

    modifier parentOrOwner() {
        require((msg.sender == owner) || parents[msg.sender]);
        _;
    }

    function isParent(address addr) view external returns (bool) {
        return parents[addr];
    }

    function addParent(address addr) external ownerOnly {
        parents[addr] = true;
    }

    function removeParent(address addr) external ownerOnly {
        delete parents[addr];
    }
}
