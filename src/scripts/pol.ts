import { EthReturn, RequestOption } from "../types/types";

import("dotenv/config");

export async function gasUsdPol(): Promise<EthReturn> {
  const myHeaders = new Headers();

  const usdt = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  myHeaders.append("Content-Type", "application/json");

  const gasPriceResponse = await fetch(
    `https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=${process.env.POLYGON_API_KEY}`
  );

  const gasPrice = await gasPriceResponse.json();
  //   console.log("gasPrice: ", gasPrice);

  // estimate gas for transferring 1 USDT  (6 decimals; data is encoded function signature and its value)
  const raw = JSON.stringify({
    method: "eth_estimateGas",
    params: [
      {
        from: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
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
    "https://polygon-rpc.com",
    requestOptions
  );
  const gasEstimated = await gasEstimateResponse.json();
  //   console.log("gasEstimated: ", gasEstimated);
  const estimatedGas = parseInt(gasEstimated.result);

  // min, avg and max gas price in GWei
  const totalGasMin = parseFloat(gasPrice.result.SafeGasPrice) * estimatedGas;
  //   console.log("totalGasMin: ", totalGasMin);

  const totalGasAvg =
    parseFloat(gasPrice.result.ProposeGasPrice) * estimatedGas;
  //   console.log("totalGasAvg: ", totalGasAvg);

  const totalGasMax = parseFloat(gasPrice.result.FastGasPrice) * estimatedGas;
  //   console.log("totalGasMax: ", totalGasMax);

  // get latest price of 1 POL
  const polyPriceResponse = await fetch(
    `https://api.polygonscan.com/api?module=stats&action=maticprice&apikey=${process.env.POLYGON_API_KEY}`
  );
  const polyPrice = await polyPriceResponse.json();
  // console.log("polyPrice: ", polyPrice);
  const polyPriceUsd = parseFloat(polyPrice.result.maticusd);

  // find USD price for gas
  const gasMinUsd = (totalGasMin * polyPriceUsd) / 10 ** 9;
  const gasAvgUsd = (totalGasAvg * polyPriceUsd) / 10 ** 9;
  const gasMaxUsd = (totalGasMax * polyPriceUsd) / 10 ** 9;

  // console.log(
  //   "gasMinUsd, gasAvgUsd, gasMaxUsd: ",
  //   gasMinUsd,
  //   gasAvgUsd,
  //   gasMaxUsd
  // );

  return { gasMinUsd, gasAvgUsd, gasMaxUsd };
}
