// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract EmojiPortal {
  uint256 totalEmojis;

  event NewEmoji(address indexed from, string author, string emoji, uint256 timestamp);

  struct Emoji{
    address sender;
    string author;
    string emoji;
    uint256 timestamp;
  }

  Emoji[] emojis;

  constructor() {
    console.log("Contract");
  }

  function submitEmoji(string memory _author, string memory _emoji) public {
    totalEmojis += 1;
    console.log('%s has emojied you', msg.sender);

    emojis.push(Emoji(msg.sender, _author, _emoji, block.timestamp));
    
    emit NewEmoji(msg.sender, _author, _emoji, block.timestamp);
 }

 function getAllEmojis() public view returns (Emoji[] memory) {
   return emojis;
 }

  function getTotalEmojis() public view returns (uint256) {
    console.log('There are total of %s emojies', totalEmojis);
    return totalEmojis;
  }

}