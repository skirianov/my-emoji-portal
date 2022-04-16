const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log('Deplying contracts with account: ', deployer.address);
  console.log('Account balance: ', accountBalance.toString());

  const emojiContractFactory = await hre.ethers.getContractFactory('EmojiPortal');
  const emojiContract = await emojiContractFactory.deploy();

  await emojiContract.deployed();

  console.log('EmojiPortal address: ', emojiContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();