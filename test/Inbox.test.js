const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const {interface, bytecode} = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
    //get a list of all accounts
    accounts = await web3.eth.getAccounts();
    //use one of those accounts to deploy the contract
    //await:
    //web3: how javascript can interact with ethereum networks
    //eth: web3 can work wit different technology, this specifies ethereum
    //Contract: constructor function, allows us to interact with existing contracts on blockchain or create and deploy new contracts
    //JSON.parse(interface): ABI, intermediation between solidity and javascript
    //inbox = javascript representation of contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        //create a new transaction object
        .deploy({data: bytecode, arguments: ['Hi there']})
        //deploys
        .send({from: accounts[0], gas:'1000000'});
        inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        //console.log(inbox);

        //if it has an address we can assume it has been deployed
        //.ok = assertion that value passed in exists
        assert.ok(inbox.options.address)
    });

    it('has a default message', async () =>{
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there');
    });

    it('can change the message', async () => {
        //send transaction(from: who pays for transaction)
        await inbox.methods.setMessage('Hello').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hello');
    });
});


/*class Car {
    park(){
        return 'stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;

beforeEach(() => {
     car = new Car();
});

describe('Car', () => {
    it('can park', () =>{
        assert.equal(car.park(), 'stopped');
    });

    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});*/