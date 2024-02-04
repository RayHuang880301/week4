import React, { useEffect, useState } from "react";
import nftImage from "../assets/nft-image.png";
import Image from "next/image";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { CONFIG } from "../../config";
import nftABI from "../abis/nftABI.json";
import { useTotalSupply } from "@/hooks/useTotalSupply";
import { useBalanceOf } from "@/hooks/useBalanceOf";
import { Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { getContractAddr } from "@/utils/getContractAddr";

export default function MintCard() {
  const toast = useToast();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { totalSupply, isLoadingTotalSupply, refetchTotalSupply } =
    useTotalSupply(chain);
  const { balance, isLoadingBalance, refetchBalance } = useBalanceOf(
    chain,
    address
  );
  const contractAddr = getContractAddr(chain);
  const { config } = usePrepareContractWrite({
    address: contractAddr,
    abi: nftABI,
    functionName: "mint",
  });
  const {
    data: mintTx,
    isLoading: isLoadingWrite,
    writeAsync,
    reset,
  } = useContractWrite(config);
  const {
    data,
    isLoading: isLoadingMint,
    isSuccess: isSuccessMint,
  } = useWaitForTransaction({
    hash: mintTx?.hash,
  });

  useEffect(() => {
    refetchTotalSupply();
    refetchBalance();
    reset();
  }, [chain]);

  useEffect(() => {
    if (isSuccessMint) {
      toast({
        title: "Minted successfully!",
        description: `Transaction hash: ${mintTx?.hash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      refetchTotalSupply();
      refetchBalance();
      reset();
    }
  }, [isSuccessMint]);

  const handleWrite = async () => {
    if (!writeAsync) return;
    try {
      await writeAsync();
    } catch (error) {
      toast({
        title: "Minting failed!",
        description: "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-center mt-8">
      <Image src={nftImage.src} width={300} height={300} alt="nft-image" />
      <p className="text-2xl">Total Minted: {totalSupply?.toString()}</p>
      <p className="text-2xl">Your Balance: {balance?.toString()}</p>
      {isLoadingWrite || isLoadingMint ? (
        <button
          disabled={true}
          className="bg-slate-500 text-white rounded-lg px-4 py-2 mt-2 hover:bg-slate-700"
        >
          <Spinner size="sm" />
        </button>
      ) : (
        <button
          className="bg-slate-500 text-white rounded-lg px-4 py-2 mt-2 hover:bg-slate-700"
          onClick={handleWrite}
        >
          Mint
        </button>
      )}
    </div>
  );
}
