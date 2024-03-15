const crypto = require("crypto");
const { buildMimcSponge } = require("circomlibjs");
const ethers = require("ethers");
const fs = require("fs");
const {Web3} = require('web3');
const { from } = require("form-data");
const path = require("path");


async function generateNull_N_Secret_To_File() {
	const commitment = await generateCommitment();
	const result = {
		nullifier: commitment.nullifier,
		secret: commitment.secret
	};
	console.log(result);

	await callCommitDeposit(commitment.commitment); 

	writeFileSync("./null_n_secret.json", JSON.stringify(result, null, 2));
}

async function generateCommitment() {
    const nullifier = ethers.BigNumber.from(randomBytes(31)).toString();
    const secret = ethers.BigNumber.from(randomBytes(31)).toString();
    return {
        nullifier: nullifier,
        secret: secret
    };
}

async function callCommitDeposit(commitment) {

    try {
        const tx = await merkleTreeContract.commitDeposit(commitment);

        // Wait for the transaction to be mined
        await tx.wait();

        console.log('Transaction successful:', tx);
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_data1",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "_data2",
				"type": "bytes32"
			}
		],
		"name": "addTuple",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint32",
				"name": "_levels",
				"type": "uint32"
			},
			{
				"internalType": "contract IHasher",
				"name": "_hasher",
				"type": "address"
			},
			{
				"internalType": "contract IVerifier",
				"name": "_verifier",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "commitment",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "leafIndex",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "Commit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_commitmentDeposit",
				"type": "uint256"
			}
		],
		"name": "commitDeposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "leaf",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes32[]",
				"name": "siblingHashes",
				"type": "bytes32[]"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "newRoot",
				"type": "bytes32"
			}
		],
		"name": "LeafInserted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint32",
				"name": "index",
				"type": "uint32"
			},
			{
				"indexed": false,
				"internalType": "bytes32",
				"name": "valueOfLeaf",
				"type": "bytes32"
			}
		],
		"name": "SubTree",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "previous_timestep",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestap",
				"type": "uint256"
			}
		],
		"name": "TimeStep",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "commitments",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentRootIndex",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FIELD_SIZE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "filledSubtrees",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLastRoot",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "level",
				"type": "uint256"
			}
		],
		"name": "getLevelHashes",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getTupleAtIndex",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTupleCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "hasher",
		"outputs": [
			{
				"internalType": "contract IHasher",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_left",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_right",
				"type": "uint256"
			}
		],
		"name": "hashLeftRight",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_root",
				"type": "bytes32"
			}
		],
		"name": "isKnownRoot",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "levelHashes",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "levels",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "myArray",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "data1",
				"type": "uint32"
			},
			{
				"internalType": "bytes32",
				"name": "data2",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextIndex",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "nullifiers",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ROOT_HISTORY_SIZE",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "roots",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "TTL",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "verifier",
		"outputs": [
			{
				"internalType": "contract IVerifier",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[2]",
				"name": "_proof_a",
				"type": "uint256[2]"
			},
			{
				"internalType": "uint256[2][2]",
				"name": "_proof_b",
				"type": "uint256[2][2]"
			},
			{
				"internalType": "uint256[2]",
				"name": "_proof_c",
				"type": "uint256[2]"
			},
			{
				"internalType": "uint256",
				"name": "_nullifierHash",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_root",
				"type": "uint256"
			}
		],
		"name": "withdrawWill",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ZERO_VALUE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			}
		],
		"name": "zeros",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
];
const contractAddress = "0xA91b1ab6b1F6E1baA8AD22D33c15E48195d3108b";
const provider = new providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/97d9c59729a745b790c2b1118ba098ef");
const PRIVATE_KEY = "1cf3bacf75f3c8580aabf395ddb3eb5bf2943ce44cc9907a60802a305c3f4e09"
const wallet = new Wallet(PRIVATE_KEY, provider);
const merkleTreeContract = new Contract(contractAddress, contractABI, wallet);

(async () => {  await generateNull_N_Secret_To_File(); })();
