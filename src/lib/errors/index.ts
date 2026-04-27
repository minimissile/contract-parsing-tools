export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidInputError";
  }
}

export class TransactionNotFoundError extends Error {
  constructor(txHash: string, chainName: string) {
    super(`Transaction ${txHash} not found on ${chainName}`);
    this.name = "TransactionNotFoundError";
  }
}

export class AbiNotFoundError extends Error {
  constructor(address: string) {
    super(`Could not find ABI for contract ${address}`);
    this.name = "AbiNotFoundError";
  }
}

export class DecodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DecodeError";
  }
}

export class RpcError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RpcError";
  }
}
