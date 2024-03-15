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
