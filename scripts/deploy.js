const main = async () => {
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy("bunny");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);

  // CHANGE THIS DOMAIN TO SOMETHING ELSE! I don't want to see OpenSea full of bananas lol
  let txn = await domainContract.register("purple",  {value: hre.ethers.utils.parseEther('0.3')});
  await txn.wait();
  console.log("Minted domain purple.bunny");

  txn = await domainContract.setRecord("purple", "Layin' Eggs");
  await txn.wait();
  console.log("Set record for purple.bunny");

  const address = await domainContract.getAddress("purple");
  console.log("Owner of domain purple:", address);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
}

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