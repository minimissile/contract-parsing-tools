import {
  decodeFunctionData,
  type Abi,
  type AbiFunction,
  type AbiParameter,
  type Hex,
} from "viem";
import type { DecodedCalldata, DecodedParam } from "@/lib/types/transaction";
import { DecodeError } from "@/lib/errors";

function formatParamValue(value: unknown): string {
  if (value === null || value === undefined) return "null";

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value.toString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map((v) => (typeof v === "bigint" ? v.toString() : v))
    );
  }

  if (typeof value === "object") {
    return JSON.stringify(value, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    );
  }

  return String(value);
}

const DECIMALS_THRESHOLD = 10n ** 12n; // only format values > 10^12
const DEFAULT_DECIMALS = 18;

function toFormattedValue(value: unknown, type: string): string | undefined {
  if (typeof value !== "bigint") return undefined;
  if (!(type.startsWith("uint") || type.startsWith("int"))) return undefined;
  if (value <= DECIMALS_THRESHOLD) return undefined;

  const divisor = 10n ** BigInt(DEFAULT_DECIMALS);
  const wholePart = value / divisor;
  const remainder = value % divisor;

  if (remainder === 0n) {
    return wholePart.toLocaleString();
  }

  // Show up to 6 significant decimal places, trim trailing zeros
  const remainderStr = remainder.toString().padStart(DEFAULT_DECIMALS, "0");
  const trimmed = remainderStr.slice(0, 6).replace(/0+$/, "");
  if (!trimmed) return wholePart.toLocaleString();
  return `${wholePart.toLocaleString()}.${trimmed}`;
}

function toRawHex(value: unknown, type: string): string | undefined {
  if (typeof value === "bigint") {
    return "0x" + value.toString(16);
  }
  if (
    typeof value === "string" &&
    (type === "bytes" || type.startsWith("bytes"))
  ) {
    return value;
  }
  return undefined;
}

function decodeParam(
  param: AbiParameter,
  value: unknown,
  index: number
): DecodedParam {
  const name = param.name || `arg${index}`;
  const type = param.type;

  // Handle tuple types (structs)
  if (type === "tuple" && "components" in param && param.components) {
    const tupleValues = value as Record<string, unknown> | readonly unknown[];
    const components = param.components.map((comp, i) => {
      const compValue = Array.isArray(tupleValues)
        ? tupleValues[i]
        : (tupleValues as Record<string, unknown>)[comp.name || `${i}`];
      return decodeParam(comp, compValue, i);
    });
    return {
      name,
      type,
      value: formatParamValue(value),
      components,
    };
  }

  // Handle tuple array types
  if (type.startsWith("tuple") && type.endsWith("[]") && "components" in param && param.components) {
    const arrayValues = value as readonly unknown[];
    const components = arrayValues.map((item, i) => {
      return decodeParam(
        { ...param, type: "tuple", name: `[${i}]` },
        item,
        i
      );
    });
    return {
      name,
      type,
      value: formatParamValue(value),
      components,
    };
  }

  const result: DecodedParam = {
    name,
    type,
    value: formatParamValue(value),
  };

  const rawHex = toRawHex(value, type);
  if (rawHex) {
    result.rawHex = rawHex;
  }

  const formatted = toFormattedValue(value, type);
  if (formatted) {
    result.formattedValue = formatted;
  }

  return result;
}

function buildFunctionSignature(fn: AbiFunction): string {
  const paramTypes = fn.inputs.map((p) => p.type).join(",");
  return `${fn.name}(${paramTypes})`;
}

export function decodeCalldata(
  inputData: Hex,
  abi: Abi
): DecodedCalldata {
  try {
    const { functionName, args } = decodeFunctionData({
      abi,
      data: inputData,
    });

    // Find the matching function in the ABI
    const abiFunction = abi.find(
      (item): item is AbiFunction =>
        item.type === "function" && item.name === functionName
    );

    if (!abiFunction) {
      throw new DecodeError(`Function ${functionName} not found in ABI`);
    }

    const selector = inputData.slice(0, 10) as Hex;
    const signature = buildFunctionSignature(abiFunction);

    const params: DecodedParam[] = abiFunction.inputs.map((input, i) => {
      const value = args ? args[i] : undefined;
      return decodeParam(input, value, i);
    });

    return {
      functionName,
      functionSignature: signature,
      selector,
      params,
    };
  } catch (error) {
    if (error instanceof DecodeError) throw error;
    throw new DecodeError(
      `Failed to decode calldata: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
