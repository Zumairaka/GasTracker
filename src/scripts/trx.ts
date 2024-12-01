import { RequestOption } from "../types/types";

export async function gasUsdTrx(): Promise<number> {
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  // estimate energy required for transferring 1 USDT  (6 decimals, data is encoded function signature and its value)

  const url = "https://api.trongrid.io/walletsolidity/triggerconstantcontract";
  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      owner_address: "TWd4WrZ9wn84f5x1hZhL4DHvk738ns5jwb",
      contract_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      function_selector: "transfer(address,uint256)",
      parameter:
        "000000000000000000000000d532f095002a4758359049402ff6c87cd486039100000000000000000000000000000000000000000000000000000000000f4240",
      visible: true,
    }),
  };

  const energyDataResponse = await fetch(url, options);
  const energyData = await energyDataResponse.json();
  // console.log(energyData);
  const energyRequired = energyData.energy_used;
  // console.log("energyRequired: ", energyRequired);

  // estimate the energy price per unit in sun (wei)
  const raw = JSON.stringify({
    method: "eth_gasPrice",
    params: [],
    id: 1,
    jsonrpc: "2.0",
  });

  const requestOptions: RequestOption = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const energyPriceResponse = await fetch(
    "https://api.trongrid.io/jsonrpc",
    requestOptions
  );
  const energyPriceEstimated = await energyPriceResponse.json();
  // console.log("gasEstimated: ", energyPriceEstimated);
  const energyPrice = parseInt(energyPriceEstimated.result);
  // console.log("energyPrice: ", energyPrice);

  // get the price of trx
  const trxPriceRequest = await fetch(
    "https://apilist.tronscanapi.com/api/token/price?tok"
  );
  const trxPrice = await trxPriceRequest.json();
  // console.log(trxPrice);
  const trxPriceUsd = trxPrice.price_in_usd;

  // total Gas in USD
  const gasInUsd = (energyRequired * energyPrice * trxPriceUsd) / 10 ** 6;
  // console.log("gasInUsd: ", gasInUsd);

  return gasInUsd;
}
