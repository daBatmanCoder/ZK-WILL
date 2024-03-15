const { buildPedersenHash } = require("circomlibjs");
// import { Buffer } from 'buffer'; // Ensure Buffer is available in your environment

// async function computeCommitmentAndNullifierHash(nullifier, secret) {
//   const pedersenHash = await buildPedersenHash();

//   // Assuming truncate function returns a Buffer
//   const nullifierBuffer = truncate(nullifier, 248);
//   const secretBuffer = truncate(secret, 248);

//   // Hash the data
//   const nullifierHashBuffer = pedersenHash.hash(nullifierBuffer);
//   const commitmentBuffer = pedersenHash.hash(Buffer.concat([nullifierBuffer, secretBuffer]));

//   // Convert hash output buffers to big-endian decimal numbers
//   const nullifierHash = bufferToBigInt(nullifierHashBuffer).toString();
//   const commitment = bufferToBigInt(commitmentBuffer).toString();

//   return { nullifierHash, commitment };
// }

// // Helper function to convert a Buffer to a BigInt
function bufferToBigInt(buffer) {
  return BigInt('0x' + buffer.toString('hex'));
}

// // Updated truncate function to return a Buffer
// function truncate(input, bitLength) {
//   const hexLength = Math.ceil(bitLength / 4);
//   const hex = input.toString(16).slice(0, hexLength).padStart(hexLength, '0');
//   return Buffer.from(hex, 'hex');
// }


async function computeCommitmentAndNullifierHash(nullifier, secret) {
  const pedersenHash = await buildPedersenHash();

  const nullifierBuffer = truncate(nullifier, 248);
  const secretBuffer = truncate(secret, 248);

  const nullifierBits = Buffer.from(nullifierBuffer);
  const secretBits = Buffer.from(secretBuffer);

  const nullifierHashBuffer = pedersenHash.hash(nullifierBits);
  const commitmentBuffer = pedersenHash.hash(Buffer.concat([nullifierBits, secretBits]));

    // Convert hash output buffers to big-endian decimal numbers
    const nullifierHash = bufferToBigInt(nullifierHashBuffer).toString();
    const commitment = bufferToBigInt(commitmentBuffer).toString();
  
  
  return {
    nullifierHash,
    commitment,
  };
}

// // Helper function to truncate input to the desired bit length
function truncate(input, bitLength) {
  const hex = input.toString(16);
  const buffer = Buffer.from(hex.padStart(Math.ceil(bitLength / 4), "0"), "hex");
  const bits = [];

  for (let i = 0; i < bitLength; i++) {
    bits.push(buffer[Math.floor(i / 8)] & (1 << (i % 8)) ? 1 : 0);
  }

  return bits;
}







const nullifier = "26530043941789512609446828508808267922987538939209577001432888982271555704";
const secret = "68727811359550031909327044372235532052265008929829473284886315217650820889";

computeCommitmentAndNullifierHash(nullifier, secret).then(({ commitment, nullifierHash }) => {
    console.log(`Nullifier: ${nullifierHash}`);
    console.log(`Commitment: ${commitment}`);
});
