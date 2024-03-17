// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

import "./ZKWillHandler.sol";

contract ZKWill is ZKWillHandler {

    constructor(
        uint32 _levels,
        IHasher _hasher,
        IVerifier _verifier
    ) ZKWillHandler(_levels, _hasher, _verifier) {}

    function commitDeposit(uint256 _commitmentDeposit) external {
        _depositWill(bytes32(_commitmentDeposit));
    }

    function withdrawWill(
        uint[2] memory _proof_a,
        uint[2][2] memory _proof_b,
        uint[2] memory _proof_c,
        uint256 _nullifierHash,
        uint256 _root
    ) external view returns (string memory){
         return _withdrawWill(
            _proof_a,
            _proof_b,
            _proof_c,
            bytes32(_nullifierHash),
            bytes32(_root)
        );
    }
}
