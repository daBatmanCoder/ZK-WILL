const insertBtn = document.getElementById('insertBtn');
// const withdrawBtn = document.getElementById('withdrawBtn');

insertBtn.addEventListener('click', async () => {
    const commitment = await generateCommitment();
    console.log(commitment.commitment);
    const result = await callCommitDeposit(commitment.commitment);
    if (result) {
        document.getElementById('resultBox').innerText = 'Insertion successful';
        document.getElementById('nullifier').innerText = commitment.nullifier;
        document.getElementById('secret').innerText = commitment.secret;
    } else {
        document.getElementById('resultBox').innerText = 'Insertion failed';
    }
});

document.getElementById('withdrawBtn').addEventListener('click', async function(event) {
    event.preventDefault();
    await fetchData();
});

async function fetchData() {
    console.log('Withdraw button clicked');
    try {
        const nullifier = document.getElementById('nullifier').innerText;
        const secret = document.getElementById('secret').innerText;
        const inputFile = await prepareProofFile(nullifier, secret);
        
        const response = await fetch('http://localhost:3000/generate-proof', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputFile),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log(responseData['result']);
        document.getElementById('withdrawResult').innerText = responseData['result'];

    } catch (error) {
        console.error('Error sending proof data:', error);
    }

    console.log('Ending');
}

