const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const emojiContractFactory = await hre.ethers.getContractFactory("EmojiPortal");
  const emojiContract = await emojiContractFactory.deploy();
  await emojiContract.deployed();

  console.log('Contract deployed to: ', emojiContract.address);
  console.log('Contract deployed by: ', owner.address);

  let emojiCount;
  emojiCount = await emojiContract.getTotalEmojis();

  let emojiTxn = await emojiContract.submitEmoji('@SergiiKirianov', '😒');
  await emojiTxn.wait();

  emojiTxn = await emojiContract.connect(randomPerson).submitEmoji('@radnom_person', '🤬');
  await emojiTxn.wait();

  let allEmojis = await emojiContract.getAllEmojis();
  console.log(allEmojis);
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
