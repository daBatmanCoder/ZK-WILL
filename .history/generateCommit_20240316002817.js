const ethers = require("ethers");

async function generateNull_N_Secret() {
	const commitment = await generateCommitment();
	const result = {
		nullifier: commitment.nullifier,
		secret: commitment.secret
	};
	console.log(result);

	await callCommitDeposit(commitment.commitment); 

	fs.writeFileSync("./null_n_secret.json", JSON.stringify(result, null, 2));
}

async function generateCommitment() {
    const nullifier = ethers.BigNumber.from(crypto.randomBytes(31)).toString();
    const secret = ethers.BigNumber.from(crypto.randomBytes(31)).toString();
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