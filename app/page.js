"use client";
import Image from "next/image";
import Header from "./Header";
import { useState, useEffect } from "react";
import { lotteryContract, getLotteryBalance } from "./Header";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  sendAndConfirmTransaction,
  prepareContractCall,
  toWei,
  readContract,
  toEther,
} from "thirdweb";
import {
  useReadContract,
  useActiveAccount,
  useSendAndConfirmTransaction,
} from "thirdweb/react";

function Money() {
  const account = useActiveAccount();
  const {
    data: numsPlayers,
    status: fetchNumsPlayersStatus,
    error: fetchNumsPlayersError,
  } = useReadContract({
    contract: lotteryContract,
    method: "function getPlayerCount() returns (uint256)",
  });
  const {
    data: lotteryBalance,
    status: fetchLotteryBalanceStatus,
    error: fetchLotteryBalanceError,
  } = useQuery({ queryFn: getLotteryBalance });
  console.log(fetchLotteryBalanceError);

  const { data: state } = useReadContract({
    contract: lotteryContract,
    method: "function getRaffleState() returns (uint256)",
  });

  console.log(state);

  const {
    data: winner,
    status: fetchWinnerStatus,
    error: fetchWinnerError,
  } = useReadContract({
    contract: lotteryContract,
    method: "function getRecentWinner() returns (address)",
  });

  const play = async () => {
    const entranceFee = await readContract({
      contract: lotteryContract,
      method: "function getEntranceFee() returns (uint256)",
    });
    const enterRaffle = async (entranceFee) => {
      const transaction = prepareContractCall({
        contract: lotteryContract,
        method: "function enterRaffle()",
        value: entranceFee,
      });
      await sendAndConfirmTransaction({
        account: account,
        transaction: transaction,
      });
    };
    await enterRaffle(entranceFee);
  };

  const {
    mutate: playGame,
    status: playStatus,
    error: playError,
  } = useMutation({
    mutationFn: play,
  });
  console.log(playStatus);
  console.log(playError);
  return (
    <div className="flex flex-col gap-10 items-center">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Recent Winner</div>
          <div className="stat-value text-6xl  text-secondary">
            {fetchWinnerStatus == "pending" && (
              <span className="loading loading-spinner"></span>
            )}
            {fetchWinnerStatus == "error" && "Error"}
          </div>
          {fetchWinnerStatus == "success" && (
            <div className="stat-value text-3xl  text-secondary">
              {winner.slice(0, 5) + "..." + winner.slice(-3)}
            </div>
          )}
          {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
        </div>
        <div className="stat">
          <div className="stat-title">Online Players</div>
          <div className="stat-value text-6xl">
            {fetchNumsPlayersStatus == "pending" && (
              <span className="loading loading-spinner"></span>
            )}
            {fetchNumsPlayersStatus == "error" && "Error"}
            {fetchNumsPlayersStatus == "success" &&
              numsPlayers.toLocaleString()}
          </div>
          {/* <div className="stat-desc">Jan 1st - Feb 1st</div> */}
        </div>
        <div className="stat">
          <div className="stat-title">Raffle Pool</div>
          <div className="stat-value text-6xl text-primary">
            {fetchLotteryBalanceStatus == "pending" && (
              <span className="loading loading-spinner"></span>
            )}
            {fetchLotteryBalanceStatus == "error" && "Error"}
            {fetchLotteryBalanceStatus == "success" && toEther(lotteryBalance)}
          </div>
        </div>
        {/* <div className="stat">
        <div className="stat-title">Your Balance</div>
        <div className="stat-value text-secondary">4,200</div>
        <div className="stat-actions flex justify-end">
          <button className="btn btn-sm ">Withdraw</button>
        </div>
      </div> */}
      </div>
      {state && state.toLocaleString() === "1" && (
        <div class="alert w-fit bg-secondary font-bold">
          Picking the winner... Please wait for the next Round to play.
        </div>
      )}
      {!account && (
        <div class="alert w-fit bg-secondary font-bold">
          Please connect your MetaMask wallet to play the game
        </div>
      )}
      <button
        className="btn btn-lg btn-secondary btn-wide"
        onClick={playGame}
        disabled={
          playStatus == "pending" ||
          !account ||
          (state && state.toLocaleString() === "1")
        }
      >
        Play
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-serif">
      <Header />
      <div className="container flex justify-center min-h-[90vh] items-center mx-auto">
        <div className="flex flex-col w-full justify-center items-center gap-5">
          <Money />
          <div className="alert bg-primary flex flex-col justify-start items-start w-fit text-left">
            <span>
              1. Click{" "}
              <button className="btn btn-sm btn-secondary">Play</button> and you
              will be charged for 0.01 ETH which will be put into Raffle Pool.
            </span>
            <span>
              2. De-Raffle will pick a random player as Winner every 30 seconds.
            </span>
            <span>
              3. All the money in Raffle Pool is sent to Winner&aposs wallet
              after each Round and next Round gets started.{""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
