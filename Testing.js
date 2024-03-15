const {Web3} = require('web3');

// Use the Infura or another provider URL
const web3 = new Web3(new Web3.providers.HttpProvider('https://endpoints.omniatech.io/v1/matic/mumbai/public'));

const contractABI = [
        {
                "anonymous": false,
                "inputs": [
                        {
                                "indexed": false,
                                "internalType": "string",
                                "name": "message",
                                "type": "string"
                        }
                ],
                "name": "LogData",
                "type": "event"
        },
        {
                "inputs": [
                        {
                                "internalType": "string",
                                "name": "message",
                                "type": "string"
                        }
                ],
                "name": "emitEvent",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
        }
];

const contractAddress = '0x7ce124e841244356874a70BDFE983Ba878e5ECf3';

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getPastEvents() {
    const events = await contract.getPastEvents('LogData', {
        fromBlock: 0, // Use appropriate block number to limit search range
        toBlock: 2
    });

    console.log('Events:', events);
}

async function getPastEvents2() {
    const events = await contract.getPastEvents('LogData', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    const messages = events.map(event => event.returnValues.message);
    const addresses = events.map(event => event.address);      
    console.log('Messages:', messages);
    console.log('Addresses:',addresses);
}

getPastEvents().catch(console.error);