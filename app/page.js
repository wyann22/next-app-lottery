"use client";
import Image from "next/image";
import Header from "./Header";
import { useState, useEffect } from "react";

function Money() {
  return (
    <div className="stats stats-vertical lg:stats-horizontal shadow">
      <div className="stat">
        <div className="stat-title">Raffle Pool</div>
        <div className="stat-value text-6xl text-primary">310000</div>
        <div className="stat-actions flex justify-end">
          <button className="btn btn-sm">Play</button>
        </div>
        {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
      </div>

      <div className="stat">
        <div className="stat-title">Your Balance</div>
        <div className="stat-value text-secondary">4,200</div>
        {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
        <div className="stat-actions flex justify-end">
          <button className="btn btn-sm ">Withdraw</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [account, setAccount] = useState("unlogin");
  const connectWallet = () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
      try {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => {
            setAccount(res[0]);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      setAccount("nowallet");
    }
  };
  console.log(account);

  return (
    <div className="font-serif">
      <Header account={account} />
      <div className="container flex justify-center min-h-[90vh] items-center mx-auto">
        <div className="flex flex-col w-full justify-center items-center gap-5">
          <Money />
          <div className="alert bg-primary flex flex-col justify-start items-start w-fit text-left">
            <span>
              1. Click <button className="btn btn-sm">Play</button> and you will
              be charged for 0.1 eth which will be put into Raffle Pool.
            </span>
            <span>
              2. De-Raffle will pick a random player as winner every 1 hours.
            </span>
            <span>
              3. Winner will get all the money in Raffle Pool and next round
              games begins.
            </span>
            <span>
              4. You can withdraw your balance to your wallet anytime by
              clicking <button className="btn btn-sm">Withdraw</button>.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
