import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import nftABI from "../abis/nftABI.json";
import { Chain } from "viem";
import { getContractAddr } from "@/utils/getContractAddr";

export const useTotalSupply = (chain: Chain | undefined) => {
  const {
    data: totalSupply,
    isLoading: isLoadingTotalSupply,
    refetch: refetchTotalSupply,
  } = useQuery({
    queryKey: ["totalSupply"],
    queryFn: () => getTotalSupply(chain),
  });
  return { totalSupply, isLoadingTotalSupply, refetchTotalSupply };
};

const getTotalSupply = async (chain: Chain | undefined) => {
  if (!chain) return BigInt(0);
  const contractAddr = getContractAddr(chain);
  if (!contractAddr) return BigInt(0);

  const totalSupply = (await readContract({
    address: contractAddr,
    abi: nftABI,
    functionName: "totalSupply",
  })) as bigint;
  return totalSupply;
};
