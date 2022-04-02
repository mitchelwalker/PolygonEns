const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory('Domains');
  const domainContract = await domainContractFactory.deploy('bunny');
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deploy by:", owner.address);

  let txn = await domainContract.register('doom', {value: hre.ethers.utils.parseEther('.1')});
  await txn.wait()
  txn = await domainContract.register('abc', {value: hre.ethers.utils.parseEther('.05')});
  await txn.wait()
  txn = await domainContract.register('doomy', {value: hre.ethers.utils.parseEther('.3')});
  await txn.wait()

  txn = await domainContract.register('doomsday', {value: hre.ethers.utils.parseEther('1234')});
  await txn.wait()


  const domainAddress = await domainContract.getAddress("doom");
  console.log("owner of domain: ", domainAddress)

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log('Contract Balance:', hre.ethers.utils.formatEther(balance))

  // Try withdrawing funds
  try {
    txn = await domainContract.connect(randomPerson).withdraw();
    await txn.wait()
  } catch(err) {
    console.log('Unable to withdraw from random wallet')
  }

  // Verify owner withdrawl
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log('Balance of Owner wallet before withdrawl', hre.ethers.utils.formatEther(ownerBalance));

  txn = await domainContract.connect(owner).withdraw();
  await txn.wait()

  const contractBalance = await hre.ethers.provider.getBalance(domainContract.address);
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log('Current balance of Contract after withdrawl: ', hre.ethers.utils.formatEther(contractBalance));
  console.log('Current balance of owner after withdrawl: ', hre.ethers.utils.formatEther(ownerBalance))

  
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