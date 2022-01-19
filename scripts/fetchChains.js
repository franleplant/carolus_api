import fetch from 'node-fetch'
import fs from 'node:fs/promises'
import _ from "lodash";
import invariant from 'ts-invariant';

const URL = `https://chainid.network/chains.json`
const CHAIN_PATH = "./chains.json"


async function main() {
  const res = await fetch(URL)
  const chains = await res.json()
  if (typeof chains !== "object") {
    throw new Error()
  }
  // create a map
  const data = _.keyBy(chains, "chainId");

  fs.writeFile(CHAIN_PATH, JSON.stringify(data))
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

