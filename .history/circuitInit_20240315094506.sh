circom verifier.circom --r1cs --wasm --sym --c

snarkjs powersoftau new bn128 15 pot15_0000.ptau -v

snarkjs powersoftau contribute pot15_0000.ptau pot15_0001.ptau --name="First contribution" -v

snarkjs powersoftau prepare phase2 pot15_0001.ptau pot15_final.ptau -v

snarkjs groth16 setup verifier.r1cs pot15_final.ptau verifier_0000.zkey

snarkjs zkey contribute verifier_0000.zkey verifier_0001.zkey --name="1st Contributor Name" -v

snarkjs zkey export verificationkey verifier_0001.zkey verification_key.json



# Computing the witness

node generate_witness.js verifier.wasm input.json witness.wtns

# Generating the proof
snarkjs groth16 prove verifier_0001.zkey ./verifier_js/witness.wtns proof.json public.json

# verifying the proof
snarkjs groth16 verify verification_key.json public.json proof.json

# Smart contract
snarkjs zkey export solidityverifier verifier_0001.zkey verifier.sol


# Run the generateCommitment script and wait for it to finish
echo "Running generateCommitment script..."
node generateCommitment.js
echo "generateCommitment script finished."

# Ensure the input.json file exists before proceeding
if [ ! -f ./circuits/verifier_js/input.json ]; then
    echo "input.json not found, exiting..."
    exit 1
fi

# Navigate to the verifier_js folder
cd ./circuits/verifier_js

# Generate the witness using the input.json file
echo "Generating the witness..."
node generate_witness.js verifier.wasm input.json witness.wtns

# Navigate back to the circuits folder
cd ..

# Generate the proof using the witness file
echo "Generating the proof..."
snarkjs groth16 prove verifier_0001.zkey verifier_js/witness.wtns proof.json public.json

# Generate the call data for the smart contract using the simplified command
echo "Generating the snark call.."
callData=$(snarkjs generatecall)