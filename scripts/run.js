const main = async () => {
  const emojiContractFactory = await hre.ethers.getContractFactory("EmojiPortal");
  const emojiContract = await emojiContractFactory.deploy();
  await emojiContract.deployed();
  console.log('Contract deployed to: ', emojiContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
