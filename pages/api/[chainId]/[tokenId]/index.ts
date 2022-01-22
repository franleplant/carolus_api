import type { NextApiRequest, NextApiResponse } from "next";
import invariant from "ts-invariant";
import ethers from "ethers";
import chains from "../../../../chains.json";
import { CONTRACT_ADDRESSES } from "../../../../src/config";
import CarolusNFTV1Artifact from "../../../../src/abi/CarolusNFTV1.json";
import type { CarolusNFTV1 } from "../../../../src/typechain/CarolusNFTV1.d";
import { ERC721Metadata } from "../../../../src/types";

interface IChain {
  name: string;
  chain: string;
  icon?: string;
  rpc: Array<string>;
  faucets: Array<string>;
  nativeCurrency: { name: string; decimals: number };
  infoURL: string;
  shortName: string;
  chainId: number;
  networkId: number;
  slip44?: number;
  ens?: { registry: string };
  explorers?: Array<{ name: string }>;
}

// goes from chainId to chain
export type IChainMap = Record<string, IChain>;

const chainMap = chains as IChainMap;

const ALLOWED_CHAINS: Record<string, boolean> = {
  // polygon
  "137": true,
  // polygon test net
  "80001": true,
};

interface ErrorData {
  error: boolean;
  data: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ERC721Metadata | ErrorData>
) {
  try {
    const { chainId, tokenId } = req.query;
    invariant(typeof chainId === "string");
    invariant(typeof tokenId === "string");
    invariant(req.method === "GET");

    if (!ALLOWED_CHAINS[chainId]) {
      return res.status(404).json({ error: true, data: "chain not supported" });
    }

    const chain = chainMap[chainId];
    if (!chain) {
      return res.status(404).json({ error: true, data: "not found" });
    }

    const contract = getContract(tokenId, chain.rpc[0]);
    const metadata = await getMetadata(tokenId, contract);

    res.status(200).json(metadata);
  } catch (err) {
    res.status(400).json({ error: true, data: JSON.stringify(err) });
  }
}

function getContract(chainId: string, rpc?: string): CarolusNFTV1 {
  if (!rpc) {
    throw new Error("missing rpc");
  }

  const provider = new ethers.providers.JsonRpcProvider({ url: rpc }, chainId);

  const address = CONTRACT_ADDRESSES[chainId];
  if (!address) {
    throw new Error("missing contract address");
  }

  const contract = new ethers.Contract(
    address,
    CarolusNFTV1Artifact.abi,
    provider
  ) as CarolusNFTV1;

  return contract;
}

export async function getMetadata(
  tokenId: string,
  contract: CarolusNFTV1
): Promise<ERC721Metadata> {
  const content = await contract.contentMap(tokenId);
  const [title, ...body] = content.trim().split("\n");

  return {
    name: title,
    description: body.join("\n"),
    // TODO makeup an image
  };
}
