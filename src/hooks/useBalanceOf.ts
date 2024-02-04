import { useQuery } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import nftABI from "../abis/nftABI.json";
import { Chain } from "viem";
import { getContractAddr } from "@/utils/getContractAddr";

export const useBalanceOf = (
  chain: Chain | undefined,
  address: string | undefined
) => {
  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ["balanceOf", address],
    queryFn: () => getBalanceOf(chain, address),
    enabled: !!address,
  });
  return { balance, isLoadingBalance, refetchBalance };
};

const getBalanceOf = async (
  chain: Chain | undefined,
  address: string | undefined
) => {
  if (!address) return BigInt(0);
  const contractAddr = getContractAddr(chain);
  if (!contractAddr) return BigInt(0);

  const balance = (await readContract({
    address: contractAddr,
    abi: nftABI,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;
  return balance;
};
