import { RequestOption } from "../types/types";

import("dotenv/config");

export async function gasUsdBsc() {
  const myHeaders = new Headers();

  const usdt = "0x55d398326f99059fF775485246999027B3197955"; // binance-peg BSC-USD
  myHeaders.append("Content-Type", "application/json");

  const gasPriceResponse = await fetch(
    `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.BSC_API_KEY}`
  );

  const gasPrice = await gasPriceResponse.json();
  // console.log("gasPrice: ", gasPrice);

  // estimate gas for transferring 1 USDT  (18 decimals, data is encoded function signature and its value)
  const raw = JSON.stringify({
    method: "eth_estimateGas",
    params: [
      {
        from: "0x88a1493366D48225fc3cEFbdae9eBb23E323Ade3",
        to: usdt,
        value: "0x0",
        data: "0xa9059cbb000000000000000000000000d532f095002a4758359049402ff6c87cd48603910000000000000000000000000000000000000000000000000DE0B6B3A7640000",
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
    "https://bsc-dataseed.binance.org",
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

  // get latest price of 1 BNB
  const bnbPriceResponse = await fetch(
    `https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=${process.env.BSC_API_KEY}`
  );
  const bnbPrice = await bnbPriceResponse.json();
  // console.log("bnbPrice: ", bnbPrice);
  const bnbPriceUsd = parseFloat(bnbPrice.result.ethusd);

  // find USD price for gas
  const gasMinUsd = (totalGasMin * bnbPriceUsd) / 10 ** 9;
  const gasAvgUsd = (totalGasAvg * bnbPriceUsd) / 10 ** 9;
  const gasMaxUsd = (totalGasMax * bnbPriceUsd) / 10 ** 9;

  // console.log(
  //   "gasMinUsd, gasAvgUsd, gasMaxUsd: ",
  //   gasMinUsd,
  //   gasAvgUsd,
  //   gasMaxUsd
  // );

  return { gasMinUsd, gasAvgUsd, gasMaxUsd };
}
