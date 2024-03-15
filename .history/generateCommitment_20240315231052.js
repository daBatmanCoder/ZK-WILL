const crypto = require("crypto");
const { buildMimcSponge } = require("circomlibjs");
const ethers = require("ethers");
const fs = require("fs");
const {Web3} = require('web3');
const { from } = require("form-data");

const ZERO_VALUE = ethers.BigNumber.from('21663839004416932945382355908790599225266501822907911457504978515578255421292')._hex // = keccak256("tornado") % FIELD_SIZE

async function generateCommitment() {
    const mimc = await buildMimcSponge();
    const nullifier = ethers.BigNumber.from(crypto.randomBytes(31)).toString();
    const secret = ethers.BigNumber.from(crypto.randomBytes(31)).toString();
    const commitment = mimc.F.toString(mimc.multiHash([nullifier, secret]));
    const nullifierHash = mimc.F.toString(mimc.multiHash([nullifier]));
    return {
        nullifier: nullifier,
        secret: secret,
        commitment: commitment,
        nullifierHash: nullifierHash
    };
}

// Assuming you have the contract ABI and address
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
const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/97d9c59729a745b790c2b1118ba098ef");
const PRIVATE_KEY = "1cf3bacf75f3c8580aabf395ddb3eb5bf2943ce44cc9907a60802a305c3f4e09"
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const merkleTreeContract = new ethers.Contract(contractAddress, contractABI, wallet);

async function constructMerklePath(levels) {
    const nextIndex = await merkleTreeContract.nextIndex();
    let pathElements = [];
    let pathIndices = [];

    for (let i = 0; i < levels; i++) {
        const isOdd = ethers.BigNumber.from(nextIndex).div(ethers.BigNumber.from(2).pow(i)).mod(2).eq(1);

        if (isOdd) {
            const filledSubtree = await merkleTreeContract.filledSubtrees(i);
            pathElements.push(filledSubtree);
            pathIndices.push(1);
        } else {
            const zeroValue = await merkleTreeContract.zeros(i);
            pathElements.push(zeroValue);
            pathIndices.push(0);
        }
    }

    return { pathElements, pathIndices };
}

// const mimcsponge = require('./mimcsponge'); 

// function buildMerkleTreeWithMimcSponge(commits) { // Hash the commits with mimcsponge const leaves =
//     commits.map(commit => mimcsponge(commit)); // Create the Merkle Tree, using mimcsponge for hashing 
//     const tree = new MerkleTree(leaves, mimcsponge, { sortPairs: true }); return tree; 
// }

// Use the Infura or another provider URL
let web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai.infura.io/v3/97d9c59729a745b790c2b1118ba098ef'));
let newcontracts = new web3.eth.Contract(contractABI, contractAddress);

(async () => {
        
    const commitments = await getPastEvents();
    const mimc = await buildMimcSponge();
    const levels = await merkleTreeContract.levels(); // Set this to your Merkle tree levels
	const null_n_secret = fs.readFileSync("./null_n_secret.json", "utf-8");
	const { nullifier, secret } = JSON.parse(null_n_secret);
	console.log(nullifier);
	console.log(secret);

	// calculateInputToProof(mimc,levels,commitments, nullifier, secret);

	const { root, pathElementsRaw, pathIndicesRaw } = await calculateMerkleRootAndPath(mimc, levels, commitments, "2993567471794227429412840266475057253900418219209110714020724241671133659637");
	console.log(pathElementsRaw);
	console.log(pathIndicesRaw);


	// Convert commitments to hex strings with '0x' prefix
	const pathElementss = pathElementsRaw.map(commitment => {
		// Check if the commitment already starts with '0x', if not, convert it to hex string
		return commitment.startsWith('0x') ? commitment : '0x' + BigInt(commitment).toString(16);
	});
	
	// // Convert path indices to numbers
	// const pathIndicess = pathIndicesRaw.map(index => parseInt(index, 10));
	
	// // Log the results
	// console.log(JSON.stringify(pathElementss, null, 2));
	// console.log(JSON.stringify(pathIndicess, null, 2));


	// const commitment = await generateCommitment();
	// const result = {
	// 	nullifier: commitment.nullifier,
	// 	secret: commitment.secret
	// };
	// fs.writeFileSync("./null_n_secret.json", JSON.stringify(result, null, 2));
	// const result = {
	// 	nullifier: commitment.nullifier,
	// 	secret: commitment.secret,
	// 	pathElements: JSON.stringify(pathElementss, null, 2),
	// 	pathIndices: JSON.stringify(pathIndicess, null, 2)
	// };


	// console.log("Generated commitment: ", commitment.commitment);
	// await callCommitDeposit(commitment.commitment); 
    // fs.writeFileSync("./circuits/verifier_js/input.json", JSON.stringify(result, null, 2));

})();



async function calculateInputToProof(mimc, levels, elements, nullifier, secret) {

	const commitment = mimc.F.toString(mimc.multiHash([nullifier, secret]));

	const { root, pathElements, pathIndices } = await calculateMerkleRootAndPath(mimc, levels, elements, commitment);

	const inputFile = {
		"nullifier": nullifier,
		"secret": secret,
		"pathElements": pathElements,
		"pathIndices": pathIndices
	};
	
	return inputFile;
}

async function calculateMerkleRootAndPath(mimc, levels, elements, element) {

	const capacity = 2 ** levels;
    if (elements.length > capacity)
        throw new Error('Tree is full');
    const zeros = await generateZeros(mimc, levels);
	console.log(zeros);
    let layers = [];
    layers[0] = elements.slice();
    for (let level = 1; level <= levels; level++) {
        layers[level] = [];
        for (let i = 0; i < Math.ceil(layers[level - 1].length / 2); i++) {
            layers[level][i] = calculateHash(mimc, layers[level - 1][i * 2], i * 2 + 1 < layers[level - 1].length ? layers[level - 1][i * 2 + 1] : zeros[level - 1]);
        }
    }
    const root = layers[levels].length > 0 ? layers[levels][0] : zeros[levels - 1];
    let pathElements = [];
    let pathIndices = [];
	pathElements[0] = element;
	console.log(element);
	
    if (element) {

        const bne = ethers.BigNumber.from(element);
        let index = layers[0].findIndex(e => ethers.BigNumber.from(e).eq(bne));

        for (let level = 0; level < levels; level++) {
			console.log(index % 2);
            pathIndices[level] = index % 2;
			const some = (index ^ 1) < layers[level].length ? layers[level][index ^ 1] : zeros[level];
			console.log(some);
            pathElements[level] = (index ^ 1) < layers[level].length ? layers[level][index ^ 1] : zeros[level];
            index >>= 1;
        }
    }

    return {
        root: root.toString(),
        pathElements: pathElements.map((v) => v.toString()),
        pathIndices: pathIndices.map((v) => v.toString())
    };
}

async function generateZeros(mimc, levels) {
	let zeros = [];
    zeros[0] = ZERO_VALUE;
    for (let i = 1; i <= levels; i++){
		zeros[i] = await merkleTreeContract.zeros(i);
        // zeros[i] = calculateHash(mimc, zeros[i - 1], zeros[i - 1]);
	}
		
    return zeros;
}

function calculateHash(mimc, left, right) {
    return ethers.BigNumber.from(mimc.F.toString(mimc.multiHash([left, right])))._hex;
}

// async function findBlockByTimestamp(targetTimestamp) {
//     let minBlock = 0;
//     let maxBlock = await provider.getBlockNumber();
//     while (minBlock < maxBlock - 1) {
//         const midBlock = Math.floor((minBlock + maxBlock) / 2);
//         const block = await provider.getBlock(midBlock);
//         if (block.timestamp < targetTimestamp) {
//             minBlock = midBlock;
//         } else {
//             maxBlock = midBlock;
//         }
//     }
//     return maxBlock;
// }

// async function calculateMerkleRootAndPathFromEvents() {
//     const abi = [
//         "event Commit(bytes32 indexed commitment,uint32 leafIndex,uint256 timestamp)"
//     ];
//     const contract = new ethers.Contract(contractAddress, abi, provider);
//     const contractInitBlock = await findContractCreationBlock();
//     console.log(contractInitBlock);

//     // const startTime = 1710484600;
//     // const startBlock = await findBlockByTimestamp(startTime);
//     // console.log(startBlock);

//     const latestBlock = await provider.getBlockNumber();
//     const blockStep = 5000; // Define a smaller batch size to avoid exceeding the block range limit

//     let fromBlock = startBlock;
//     let commitments = [];

//     while (fromBlock <= latestBlock) {
//         const toBlock = Math.min(fromBlock + blockStep, latestBlock);

//         // Query filter for a specific range
//         const events = await contract.queryFilter(contract.filters.Commit(), fromBlock, toBlock);
//         for (let event of events) {
//             // Check if the event's timestamp matches your criteria before adding
//             if (event.args.timestamp >= startTime) {
//                 commitments.push(event.args.commitment);
//             }
//         }

//         // Prepare for the next iteration
//         fromBlock = toBlock + 1;
//     }

//     console.log(commitments);
// }

// async function findContractCreationBlock() {
//     const latestBlockNumber = await provider.getBlockNumber();
//     let found = false;

//     for (let i = latestBlockNumber; i >= 0 && !found; i--) {
//         const block = await provider.getBlockWithTransactions(i);
//         for (const tx of block.transactions) {
//             // Check if the contract creation transaction
//             if (tx.to === null && tx.creates === contractAddress.toLowerCase()) {
//                 console.log(`Contract ${contractAddress} was created in block ${i}`);
//                 found = true;
//                 break;
//             }
//         }
//     }

//     if (!found) {
//         console.log(`Could not find the contract creation block for ${contractAddress}`);
//     }
// }

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



async function getPastEvents() {
    const events = await newcontracts.getPastEvents('Commit', {
        fromBlock: 0, // Use appropriate block number to limit search range
        toBlock: 'latest'
    });
	const commitments = events.map(events => events.returnValues.commitment);

    console.log('Commitments:', commitments);
	return commitments;
}

