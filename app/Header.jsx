"use client";

import { createThirdwebClient, getContract } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { useConnect, useActiveAccount } from "thirdweb/react";
import { useEffect, useState } from "react";
import { sepolia } from "thirdweb/chains";
import { getRpcClient, eth_getBalance } from "thirdweb/rpc";

const client = createThirdwebClient({
  clientId: "19384c95c09239d3ea2a87a48b6bdcc5",
});

export const lotteryContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: sepolia,
  // the contract's address
  address: process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDR,
  // OPTIONAL: the contract's abi
});
export const getLotteryBalance = async () => {
  try {
    const rpcRequest = getRpcClient({ client: client, chain: sepolia });
    const balance = await eth_getBalance(rpcRequest, {
      address: lotteryContract.address,
    });
    return balance;
  } catch (error) {
    throw error;
  }
};
export default function Header() {
  const account = useActiveAccount();
  const { connect, isConnecting, error } = useConnect();
  const connectWallet = async () => {
    connect(async () => {
      const metamask = createWallet("io.metamask"); // pass the wallet id
      // if user has metamask installed, connect to it
      if (injectedProvider("io.metamask")) {
        await metamask.connect({ client });
      } else {
        await metamask.connect({
          client,
          walletConnect: { showQrModal: true },
        });
      }
      return metamask;
      // return the wallet
    });
  };
  useEffect(() => {
    connectWallet();
  }, []);
  const shortenAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  return (
    <div className="navbar btm-nav-lg bg-secondary">
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl text-pretty text-base-100 font-serif font-extrabold">
          De-Raffle
        </a>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          {!account ? (
            isConnecting ? (
              <div className=" text-base-100">Connecting ...</div>
            ) : (
              <button
                className="btn btn-primary text-base-100 "
                onClick={connectWallet}
              >
                Connect Metamask
              </button>
            )
          ) : (
            <button className="btn btn-primary text-base-100 ">
              {shortenAddress(account.address)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
