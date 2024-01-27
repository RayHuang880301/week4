import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { CONFIG } from "../../config";
import nftABI from "../abis/nftABI.json";

export const useTotalSupply = () => {
  const {
    data: totalSupply,
    isLoading: isLoadingTotalSupply,
    refetch: refetchTotalSupply,
  } = useQuery({
    queryKey: ["totalSupply"],
    queryFn: () => getTotalSupply(),
  });
  return { totalSupply, isLoadingTotalSupply, refetchTotalSupply };
};

const getTotalSupply = async () => {
  const totalSupply = (await readContract({
    address: CONFIG.NFT_CONTRACT_ADDRESS,
    abi: nftABI,
    functionName: "totalSupply",
  })) as bigint;
  return totalSupply;
};
