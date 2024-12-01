import { createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

import {
  Connection,
  clusterApiUrl,
  Transaction,
  PublicKey,
} from "@solana/web3.js";

export async function gasUsdSol() {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  const lamportsPerSignature = 5000; // currently fee is fixed as 5000 lamports per signature
  const usdt = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"); // USDT in mainnet
  const from = new PublicKey("5tzFkiKscXHK5ZXCGbXZxdw7gTjjD1mBwuoFbhUvuAi9"); // binance2 public key
  const to = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"); // binance3 public key
  const fromAccount = new PublicKey(
    "CyBjGpte4Npi5zNkdtWumPxVW4kpMR8BuFSbA587xZES" // binance2 ATA for USDT
  );
  const toAccount = new PublicKey(
    "TB5FCqbNsnuLQgEjUuPaT9qtVPTT4U1A8rvi7qzEj2M" // binance3 ATA USDT
  );
  const amount = 1000000; // 1 USDT

  // create a token transfer transaction for calculating compute units (CU)
  const transaction = new Transaction().add(
    createTransferInstruction(
      fromAccount,
      toAccount,
      from,
      amount,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const recentBlockhash: any = await connection.getLatestBlockhash();
  transaction.recentBlockhash = recentBlockhash;
  transaction.feePayer = from;

  // compile the txn
  transaction.compileMessage();
  // console.log(message);
  const simulationResult = await connection.simulateTransaction(transaction);
  // console.log(simulationResult);

  const computeUnits: any = simulationResult.value.unitsConsumed; // total fee in lamports
  // console.log("computeUnits: ", computeUnits);
  const computeUnitPrice = 10; // 10 lamports (we can set this price. currently this fee is not required. But can be set as priority fee)

  // fetch current price for SOL
  const solPriceRequest = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  );
  const solPrice = await solPriceRequest.json();
  // console.log("solPrice: ", solPrice.solana.usd);
  const minTxnCostUsd =
    (lamportsPerSignature * 1 * solPrice.solana.usd) / 10 ** 9; // 1 signature is required for this txn
  const maxTxnCostUsd =
    minTxnCostUsd +
    (computeUnits * computeUnitPrice * solPrice.solana.usd) / 10 ** 9; // max fee is basic + compute units price
  const avgTxnCostUsd = (minTxnCostUsd + maxTxnCostUsd) / 2;
  // console.log("minTxnCostUsd: ", minTxnCostUsd);
  // console.log("avgTxnCostUsd: ", avgTxnCostUsd);
  // console.log("maxTxnCostUsd: ", maxTxnCostUsd);

  return { minTxnCostUsd, avgTxnCostUsd, maxTxnCostUsd };
}
