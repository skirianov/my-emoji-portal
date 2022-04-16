// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract EmojiPortal {
  uint256 totalEmojis;

  constructor() {
    console.log("Contract");
  }

  function submitEmoji() public {
    totalEmojis += 1;
    console.log('%s has emojied you', msg.sender);
  }

  function getTotalEmojis() public view returns (uint256) {
    console.log('There are total of %s emojies', totalEmojis);
    return totalEmojis;
  }

}