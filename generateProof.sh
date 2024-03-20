# !/bin/bash

# Run the generateCommitment script and wait for it to finish
echo "Running generateCommitment script..."
# node generateCommit.js
echo "generateCommitment script finished."

echo "Generating proof..."
node generateProof.js

# Ensure the input.json file exists before proceeding
if [ ! -f ./circuits/verifier_js/input.json ]; then
    echo "input.json not found, exiting..."
    exit 1
fi

# Navigate to the verifier_js folder
cd ./circuits/verifier_js

# Generate the witness using the input.json file
echo "Generating the witness, snarkjs and call..."
node generate_witness.js verifier.wasm input.json witness.wtns

# Navigate back to the circuits folder
cd ..

# Generate the proof using the witness file
snarkjs groth16 prove verifier_0001.zkey verifier_js/witness.wtns proof.json public.json

# Generate the call data for the smart contract using the simplified command
callData=$(snarkjs generatecall)

snarkjs generatecall

# # # Navigate back to the root directory
# cd ..

# # Call the callWithdraw.js script with the captured call data
# node callWithdraw.js "$callData"
