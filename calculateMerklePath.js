async function calculateMerklePath(commitment, root, totalDeposits) {
    const mimc = await buildMimcSponge();
    const commitmentHash = mimc.F.toString(mimc.multiHash([commitment]));
    let pathElements = [];
    let pathIndices = [];
    let nodeIndex = BigInt(commitmentHash) % BigInt(totalDeposits);
  
    for (let level = 0; level < levels; level++) {
      const siblingIndex = nodeIndex ^ BigInt(1);
      const siblingHash = await contract.getMerkleNode(siblingIndex, level);
      pathElements.push(siblingHash);
      pathIndices.push(siblingIndex < nodeIndex ? 1 : 0);
  
      nodeIndex >>= BigInt(1);
    }
  
    return { pathElements, pathIndices };
  }