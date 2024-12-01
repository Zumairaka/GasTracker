import { RequestOption } from "../types/types";

export async function gasUsdXdc() {
  const myHeaders = new Headers();

  const usdt = "0xd4b5f10d61916bd6e0860144a91ac658de8a1437";
  myHeaders.append("Content-Type", "application/json");

  const statsResponse = await fetch(`https://api.xdcscan.io/stats`);

  const stats = await statsResponse.json();
  // console.log("stats: ", stats);
  const slowGasPrice = stats.gas_prices.slow.price;
  const avgGasPrice = stats.gas_prices.average.price;
  const fastGasPrice = stats.gas_prices.fast.price;
  const xdcPriceUsd = stats.coin_price;
  // console.log(slowGasPrice, avgGasPrice, fastGasPrice, xdcPriceUsd);

  // estimate gas for transferring 1 USDT  (6decimals, data is encoded function signature and its value)
  const raw = JSON.stringify({
    method: "eth_estimateGas",
    params: [
      {
        from: "0x4821cdc4b01bfee77c6ab8abc9348c4351600e26",
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
    "https://rpc.xinfin.network",
    requestOptions
  );
  const gasEstimated = await gasEstimateResponse.json();
  // console.log("gasEstimated: ", gasEstimated);
  const estimatedGas = parseInt(gasEstimated.result);
  // console.log("estimatedGas: ", estimatedGas);

  // min, avg and max gas price in GWei
  const totalGasSlow = slowGasPrice * estimatedGas;
  // console.log("totalGasMin: ", totalGasSlow);

  const totalGasAvg = avgGasPrice * estimatedGas;
  // console.log("totalGasAvg: ", totalGasAvg);

  const totalGasFast = fastGasPrice * estimatedGas;
  // console.log("totalGasMax: ", totalGasFast);

  // find USD price for gas
  const gasMinUsd = (totalGasSlow * xdcPriceUsd) / 10 ** 9;
  const gasAvgUsd = (totalGasAvg * xdcPriceUsd) / 10 ** 9;
  const gasMaxUsd = (totalGasFast * xdcPriceUsd) / 10 ** 9;

  // console.log(
  //   "gasMinUsd, gasAvgUsd, gasMaxUsd: ",
  //   gasMinUsd,
  //   gasAvgUsd,
  //   gasMaxUsd
  // );

  return { gasMinUsd, gasAvgUsd, gasMaxUsd };
}
