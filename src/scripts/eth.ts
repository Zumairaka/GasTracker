import { RequestOption } from "../types/types";

import("dotenv/config");

export async function gasUsdEth() {
  const myHeaders = new Headers();

  const usdt = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  myHeaders.append("Content-Type", "application/json");

  const gasPriceResponse = await fetch(
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETH_API_KEY}`
  );

  const gasPrice = await gasPriceResponse.json();
  // console.log("gasPrice: ", gasPrice);

  // estimate gas for transferring 1 USDT  (6decimals, data is encoded function signature and its value)
  const raw = JSON.stringify({
    method: "eth_estimateGas",
    params: [
      {
        from: "0x28C6c06298d514Db089934071355E5743bf21d60",
        to: usdt,
        value: "0x0",
        data: "0xa9059cbb000000000000000000000000d532f095002a4758359049402ff6c87cd486039100000000000000000000000000000000000000000000000000000000000f4240",
      },
    ],
    id: 1,
    jsonrpc: "2.0",
  });

  const requestOptions: RequestOption = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const gasEstimateResponse = await fetch(
    "https://ethereum-rpc.publicnode.com",
    requestOptions
  );
  const gasEstimated = await gasEstimateResponse.json();
  // console.log("gasEstimated: ", gasEstimated);
  const estimatedGas = parseInt(gasEstimated.result);

  // min, avg and max gas price in GWei
  const totalGasMin = parseFloat(gasPrice.result.SafeGasPrice) * estimatedGas;
  // console.log("totalGasMin: ", totalGasMin);

  const totalGasAvg =
    parseFloat(gasPrice.result.ProposeGasPrice) * estimatedGas;
  // console.log("totalGasAvg: ", totalGasAvg);

  const totalGasMax = parseFloat(gasPrice.result.FastGasPrice) * estimatedGas;
  // console.log("totalGasMax: ", totalGasMax);

  // get latest price of 1 ETH
  const ethPriceResponse = await fetch(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETH_API_KEY}`
  );
  const ethPrice = await ethPriceResponse.json();
  // console.log("ethPrice: ", ethPrice);
  const ethPriceUsd = parseFloat(ethPrice.result.ethusd);

  // find USD price for gas
  const gasMinUsd = (totalGasMin * ethPriceUsd) / 10 ** 9;
  const gasAvgUsd = (totalGasAvg * ethPriceUsd) / 10 ** 9;
  const gasMaxUsd = (totalGasMax * ethPriceUsd) / 10 ** 9;

  // console.log(
  //   "gasMinUsd, gasAvgUsd, gasMaxUsd: ",
  //   gasMinUsd,
  //   gasAvgUsd,
  //   gasMaxUsd
  // );

  return { gasMinUsd, gasAvgUsd, gasMaxUsd };
}
