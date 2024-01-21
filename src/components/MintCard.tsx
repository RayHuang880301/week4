import React, { useEffect, useState } from "react";
import nftImage from "../assets/nft-image.png";
import Image from "next/image";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { CONFIG } from "../../config";
import nftABI from "../abis/nftABI.json";

export default function MintCard() {
  const { address } = useAccount();
  const [totalSupply, setTotalSupply] = useState<string>("0");
  const [balance, setBalance] = useState<string>("0");
  const { config } = usePrepareContractWrite({
    address: CONFIG.NFT_CONTRACT_ADDRESS,
    abi: nftABI,
    functionName: "mint",
  });
  const { data: txHash, write } = useContractWrite(config);

  const { data: total } = useContractRead({
    address: CONFIG.NFT_CONTRACT_ADDRESS,
    abi: nftABI,
    functionName: "totalSupply",
  });

  const { data: amount } = useContractRead({
    address: CONFIG.NFT_CONTRACT_ADDRESS,
    abi: nftABI,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (total) {
      setTotalSupply(total.toString());
    }
  }, [total]);

  useEffect(() => {
    if (amount) {
      setBalance(amount.toString());
    }
  }, [amount]);

  return (
    <div className="flex flex-col w-full justify-center items-center mt-8">
      <Image src={nftImage.src} width={300} height={300} alt="nft-image" />
      <p className="text-2xl">Total Minted: {totalSupply}</p>
      <p className="text-2xl">Your Balance: {balance}</p>
      <button
        className="bg-slate-500 text-white rounded-lg px-4 py-2 mt-2 hover:bg-slate-700"
        disabled={!write}
        onClick={() => write?.()}
      >
        Mint
      </button>
    </div>
  );
}
