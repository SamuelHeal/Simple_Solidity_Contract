const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config();

const { abi, evm } = require('./compile');

provider = new HDWalletProvider(
  process.env.ETH_MNEMONIC,
  process.env.INFURA_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const ownerAccount = accounts[0];
  const initialMessage = 'Hi there!';

  console.log('Attempting to deploy from account', ownerAccount);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: [initialMessage] })
    .send({ gas: '1000000', from: ownerAccount });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
