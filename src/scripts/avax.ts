import { RequestOption } from "../types/types";

export async function gasUsdAvax() {
  const myHeaders = new Headers();

  const usdt = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7";
  myHeaders.append("Content-Type", "application/json");

  const gasPriceResponse = await fetch(
    `https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=proxy&action=eth_gasPrice&apikey=YourApiKeyToken`
  );

  const gasPrice = await gasPriceResponse.json();
  // console.log("gasPrice: ", gasPrice);
  const avgGasPrice = parseInt(gasPrice.result) / 10 ** 9; // gas price in wei; convert to GWei
  // console.log("gasPrice: ", avgGasPrice);

  // estimate gas for transferring 1 USDT  (6 decimals, data is encoded function signature and its value)
  const raw = JSON.stringify({
    method: "eth_estimateGas",
    params: [
      {
        from: "0x4aeFa39caEAdD662aE31ab0CE7c8C2c9c0a013E8",
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
    "https://api.avax.network/ext/bc/C/rpc",
    requestOptions
  );
  const gasEstimated = await gasEstimateResponse.json();
  // console.log("gasEstimated: ", gasEstimated);

  // avg gas price in GWei
  const totalGasAvg = avgGasPrice * parseInt(gasEstimated.result);
  // console.log("totalGasAvg: ", totalGasAvg);

  // get latest price of 1 AVAX
  const avaxPriceResponse = await fetch(
    `https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=stats&action=ethprice&apikey=YourApiKeyToken`
  );
  const avaxPrice = await avaxPriceResponse.json();
  // console.log("avaxPrice: ", avaxPrice);
  const avaxPriceUsd = parseFloat(avaxPrice.result.ethusd);

  // find USD price for gas
  const gasAvgUsd = (totalGasAvg * avaxPriceUsd) / 10 ** 9;
  // console.log("gasAvgUsd: ", gasAvgUsd);

  return gasAvgUsd;
}
