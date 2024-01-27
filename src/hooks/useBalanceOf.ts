import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import { CONFIG } from "../../config";
import nftABI from "../abis/nftABI.json";

export const useBalanceOf = (address: string | undefined) => {
  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ["balanceOf", address],
    queryFn: () => getBalanceOf(address),
    enabled: !!address,
  });
  return { balance, isLoadingBalance, refetchBalance };
};

const getBalanceOf = async (address: string | undefined) => {
  if (!address) return BigInt(0);
  const balance = (await readContract({
    address: CONFIG.NFT_CONTRACT_ADDRESS,
    abi: nftABI,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;
  return balance;
};
