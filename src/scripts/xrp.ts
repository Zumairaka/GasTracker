import { RequestOption, XrpReturn } from "../types/types";

export async function gasUsdXrp(): Promise<XrpReturn> {
  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/json");

  // estimate loca load cost for transfer (its foxed for most of the txns)
  const raw = JSON.stringify({
    method: "server_info",
    params: [{ counters: false }],
  });

  const requestOptions: RequestOption = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const txnCostResponse = await fetch(
    "http://s1.ripple.com:51234/",
    requestOptions
  );
  const txnCostEstimated = await txnCostResponse.json();
  //   console.log("txnCostEstimated: ", txnCostEstimated);
  const baseFeeXrp = txnCostEstimated.result.info.validated_ledger.base_fee_xrp;
  const loadFactor = txnCostEstimated.result.info.load_factor;
  const localLoadCost = baseFeeXrp * loadFactor;
  //   console.log("localLoadCost: ", localLoadCost);

  // estimate open ledger cost for transfer (the fee for including in the current open ledger)
  const openRequestOptions: RequestOption = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      method: "fee",
      params: [{}],
    }),
    redirect: "follow",
  };

  const openCostResponse = await fetch(
    "http://s1.ripple.com:51234/",
    openRequestOptions
  );
  const openCostEstimated = await openCostResponse.json();
  //   console.log("openCostEstimated: ", openCostEstimated);
  const openLedgerCost = openCostEstimated.result.drops.open_ledger_fee; // in drops (1XRP = 10^6 drops)
  //   console.log("openLedgerCost: ", openLedgerCost);

  // fetch XRP price in USD
  const metrics = await fetch(
    "https://api.diadata.org/v1/assetInfo/Ripple/0x0000000000000000000000000000000000000000"
  );
  const data = await metrics.json();
  const xrpUsd = data.Price;
  //   console.log(xrpUsd);

  // compute local load cost and open ledger cost in USD
  const loadLocalCostUsd = localLoadCost * xrpUsd;
  const openLedgerCostUsd = (openLedgerCost * xrpUsd) / 10 ** 6;
  //   console.log(loadLocalCostUsd, openLedgerCostUsd);

  return { loadLocalCostUsd, openLedgerCostUsd };
}
