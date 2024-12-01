// The fee is based on the values set by the routing channel.
// Detailed description on fees on btc is given in readme under BTC Lightning section.
// In this script, the fee calculation is done based on the major prcatice on minimum and maximum fee.

export async function gasUsdBtcLtn() {
  // fetch the price for USDT in BTC (every txn on Lightnin network is as number of Satoshis)
  const priceResponse = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
  );
  const priceBtc = await priceResponse.json();
  //   console.log("btc price: ", priceBtc.price);

  // transfer of 1USDT is equivalent to how many satoshis
  const transferAmount = 10 ** 8 / priceBtc.price;
  //   console.log("transferAmountInSats: ", transferAmount);

  // min and max basefee in satoshi
  const minBaseFee = 0.001;
  const maxBaseFee = 1;
  const minFeeRate = 0.0001; // 1 ppm mean 0.0001%
  const maxFeeRate = 0.1; // 1000 ppm 0.1%

  const minFee = (transferAmount * minFeeRate) / 100; // 1 ppm means 1 sat as fee per 1M sats transaction
  const maxFee = (transferAmount * maxFeeRate) / 100; // 1000 ppm means 1000 sat as fee per 1M sats transaction
  const totalMinFeeSats = minBaseFee + minFee;
  const totalMaxFeeSats = maxBaseFee + maxFee;
  //   console.log("totalMinFeeSats: ", totalMinFeeSats);
  //   console.log("totalMaxFeeSats:", totalMaxFeeSats);

  const totalMinFeeUsd = (totalMinFeeSats * priceBtc.price) / 10 ** 8;
  const totalMaxFeeUsd = (totalMaxFeeSats * priceBtc.price) / 10 ** 8;
  //   console.log("totalMinFeeUsd: ", totalMinFeeUsd);
  //   console.log("totalMaxFeeUsd: ", totalMaxFeeUsd);

  return { totalMinFeeUsd, totalMaxFeeUsd };
}
