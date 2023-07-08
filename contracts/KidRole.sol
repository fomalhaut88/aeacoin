// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ParentRole.sol";


contract KidRole is ParentRole {
    mapping (address => bool) public kids;

    modifier kidOnly() {
        require(kids[msg.sender]);
        _;
    }

    modifier kidOrParent() {
        require(parents[msg.sender] || kids[msg.sender]);
        _;
    }

    modifier kidOrParentOrOwner() {
        require((msg.sender == owner) || parents[msg.sender] || kids[msg.sender]);
        _;
    }

    function isKid(address addr) view external returns (bool) {
        return kids[addr];
    }

    function addKid(address addr) external parentOrOwner {
        kids[addr] = true;
    }

    function removeKid(address addr) external parentOrOwner {
        delete kids[addr];
    }
}
