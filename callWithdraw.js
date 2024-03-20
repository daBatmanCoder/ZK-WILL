const ethers = require('ethers');

// Connect to Ethereum
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai-bor-rpc.publicnode.com');
const wallet = new ethers.Wallet('1cf3bacf75f3c8580aabf395ddb3eb5bf2943ce44cc9907a60802a305c3f4e09', provider);

// Smart contract ABI and address
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
const contractAddress = '0xA91b1ab6b1F6E1baA8AD22D33c15E48195d3108b';
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Function to call withdrawWill
async function callWithdraw(callData) {

	// console.log('callData:', callData);

    // Manually split the string to extract the arguments
    const parts = callData.split(',[');

    // Extract and process proof_a, proof_b, proof_c
    const proof_a_string = parts[0];
    const proof_a = JSON.parse(proof_a_string);

    const proof_b_1 = "[" + callData.split(',[')[1];
    const proof_b_2 = "[" + callData.split('],[')[2] + "]";
    const proof_b_string = proof_b_1 + "," + proof_b_2;  
    const proof_b = JSON.parse(proof_b_string);

    const proof_c_string = "[" + callData.split('],[')[3] + "]";
    const proof_c = JSON.parse(proof_c_string);


    // Extract and process nullifierHash and root
    const nullifier_n_root = parts[4].replace(/[\[\]]/g, '').split(',');

    const nullifierHashString = nullifier_n_root[0].trim().replace(/^"|"$/g, '');
    const rootString = nullifier_n_root[1].trim().replace(/^"|"$/g, '');

    // Convert proof_a, proof_b, proof_c to BigNumber format
    const proof_a_BigNumber = proof_a.map(ethers.BigNumber.from);
    const proof_b_BigNumber = proof_b.map(innerArray => innerArray.map(ethers.BigNumber.from));
    const proof_c_BigNumber = proof_c.map(ethers.BigNumber.from);

    // Convert nullifierHash and root to BigNumber format
    const nullifierHash = ethers.BigNumber.from(nullifierHashString);
    const root = ethers.BigNumber.from(rootString); 

    
    // console.log('proof_a in BigNumber format:', proof_a_BigNumber);
    // console.log('proof_b in BigNumber format:', proof_b_BigNumber);
    // console.log('proof_c in BigNumber format:', proof_c_BigNumber);
    // console.log('nullifierHash: ', nullifierHash);
    // console.log('root: ', root);

    // Call the withdrawWill function
    const result = await contract.withdrawWill(proof_a, proof_b, proof_c, nullifierHash, root);
	
    console.log(result);
}

// Get callData from command line argument
const callData = process.argv[2];

// Call the function
callWithdraw(callData).catch(console.error);
