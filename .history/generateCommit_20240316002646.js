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