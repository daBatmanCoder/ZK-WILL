const insertBtn = document.getElementById('insertBtn');
const withdrawBtn = document.getElementById('withdrawBtn');

insertBtn.addEventListener('click', async () => {

    const commitments = await generateCommitment();
    // console.log('Generated commitment:', commitments);
    console.log(commitments.commitment);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // await contract.insert(commitments.commitment);  // Replace 'insert' with your actual contract function for adding a commitment
});

withdrawBtn.addEventListener('click', async () => {
    // Call your backend to generate a proof based on the saved nullifier and secret
    // This is a pseudo-code. Replace it with your actual AJAX call or Fetch API call to your backend
    const response = await fetch('/generateProof', { method: 'POST' });
    const { proof } = await response.json();
    console.log('Proof generated:', proof);
    
    // Withdraw using the generated proof (replace with your actual contract method call)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.withdrawWill(proof);  // Replace 'withdrawWill' with your actual contract function for withdrawing
});
