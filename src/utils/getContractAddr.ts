import { Chain } from "viem";
import { lineaTestnet, sepolia } from "viem/chains";
import { CONFIG } from "../../config";

export const getContractAddr = (chain: Chain | undefined) => {
  if (!chain) return undefined;
  let contractAddr;
  if (chain.id === sepolia.id) {
    contractAddr = CONFIG.SEPOLIA_NFT_CONTRACT_ADDRESS;
  } else if (chain.id === lineaTestnet.id) {
    contractAddr = CONFIG.LINEA_TESTNET_NFT_CONTRACT_ADDRESS;
  } else {
    contractAddr = undefined;
  }
  return contractAddr;
};
