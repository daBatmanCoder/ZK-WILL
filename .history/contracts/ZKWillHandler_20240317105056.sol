// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "./MerkleTreeWithHistory.sol";

interface IVerifier {

    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) external pure returns (bool r);

}

contract ZKWillHandler is MerkleTreeWithHistory {

    mapping(bytes32 => bool) public nullifiers;
    mapping(bytes32 => bool) public commitments;
    mapping(address => uint256) public TTL;

    IVerifier public immutable verifier;

    event Commit(
        bytes32 indexed commitment,
        uint32 leafIndex,
        uint256 timestamp
    );

    event TimeStep(
        uint256 previous_timestep,
        uint256 timestap
    );

    constructor(
        uint32 _levels,
        IHasher _hasher,
        IVerifier _verifier
    ) MerkleTreeWithHistory(_levels, _hasher) {
        verifier = _verifier;
    }

    function _depositWill(bytes32 _commitmentDeposit) internal {
        require(!commitments[_commitmentDeposit], "The commitment has been submitted");

        commitments[_commitmentDeposit] = true;

        TTL[msg.sender] = block.timestamp;

        uint32 insertedIndex = _insert(_commitmentDeposit);
        emit Commit(_commitmentDeposit, insertedIndex, block.number);
    }

    function _withdrawWill(
        uint[2] memory _proof_a,
        uint[2][2] memory _proof_b,
        uint[2] memory _proof_c,
        bytes32 _nullifierHash,
        bytes32 _root
    ) internal view returns (string memory){
        require(!nullifiers[_nullifierHash], "The nullifier has been submitted");
        require(isKnownRoot(_root), "Cannot find your merkle root");
        require(
            verifier.verifyProof(
                _proof_a,
                _proof_b,
                _proof_c,
                [uint256(_nullifierHash), uint256(_root)]
            ),
            "Invalid proof"
        );

        uint secondsElapsed = (block.timestamp - TTL[msg.sender]) * 2;
        string memory secondsPast = uintToString(secondsElapsed);
        return string(abi.encodePacked(secondsPast, " seconds past from the deposit"));
    }

    function uintToString(uint v) internal pure returns (string memory) {
        uint maxlength = 100;
        bytes memory reversed = new bytes(maxlength);
        uint i = 0;
        while (v != 0) {
            uint remainder = v % 10;
            v = v / 10;
            reversed[i++] = bytes1(uint8(48 + remainder));
        }
        bytes memory s = new bytes(i);
        for (uint j = 0; j < i; j++) {
            s[j] = reversed[i - 1 - j];
        }

        return string(s);
    }

}