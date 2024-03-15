from Crypto.Hash import keccak

FIELD_SIZE = 21888242871839275222246405745257275088548364400416034343698204186575808495617

zero_value_string = "tornado"
keccak_256 = keccak.new(digest_bits=256)
keccak_256.update(zero_value_string.encode())

decimal_number = int(keccak_256.hexdigest(), 16)


result = decimal_number % FIELD_SIZE
print(result)