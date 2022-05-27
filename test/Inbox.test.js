const assert = require('assert');
// testing package
const ganache = require('ganache-cli');
// Web3 must be a capital by convention as it is a constructor function
const Web3 = require('web3');

// creating an instance of Web3
// a provider is like an means of communicating between ganache, and web3 and is mandatory
const web3 = new Web3(ganache.provider());

const { abi, evm } = require('../compile');

let accounts;
let ownerAccount;
let inbox;
const initialString = 'Hi there!';

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  ownerAccount = accounts[0];
  // Deploying the contract to one of the accounts
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [initialString],
    })
    .send({ from: ownerAccount, gas: '1000000' });
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('Initial message present & correct', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, initialString);
  });

  it('Message can be updated', async () => {
    await inbox.methods.setMessage('Test').send({ from: ownerAccount });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'Test');
  });
});
