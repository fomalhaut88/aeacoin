// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


contract Ownable {
    address payable internal owner;

    constructor() {
        owner = payable(msg.sender);
    }

    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    function isOwner(address addr) view external returns (bool) {
        return addr == owner;
    }

    function changeOwner(address payable newOwner) external ownerOnly {
        owner = newOwner;
    }

    function transferToOwner(uint amount) external ownerOnly {
        owner.transfer(amount);
    }
}
