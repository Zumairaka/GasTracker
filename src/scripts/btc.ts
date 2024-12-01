// The fee is based on the rate per bytes in satoshis and number of bytes in the transactions
// Detailed description on fees on btc is given in readme under BTC section.

export async function gasUsdBtc() {
  // fetch the price for USDT in BTC (every txn on Lightnin network is as number of Satoshis)
  const priceResponse = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
  );
  const priceBtc = await priceResponse.json();
  // console.log("btc price: ", priceBtc.price);

  // transfer of 1USDT is equivalent to how many satoshis
  const transferAmount = 10 ** 8 / priceBtc.price;
  // console.log("transferAmountInSats: ", transferAmount);

  // fetch the rate per bytes in satoshis
  const rateResponse = await fetch(
    "https://blockstream.info/api/fee-estimates"
  );
  const ratePerBytes = await rateResponse.json();
  // console.log("ratePerBytes: ", ratePerBytes);

  // fetch rate per bytes for confirmation on various blocks
  const oneBlockRate = ratePerBytes[1];
  // console.log("oneBlockRate: ", oneBlockRate);
  const threeBlockRate = ratePerBytes[3];
  // console.log("threeBlockRate: ", threeBlockRate);
  const sixBlockRate = ratePerBytes[6];
  // console.log("sixBlockRate: ", sixBlockRate);
  const tenthBlockRate = ratePerBytes[10];
  // console.log("tenthBlockRate: ", tenthBlockRate);

  // txId is one input and 1 output for transfer function as (toAddress, amount)
  const transactionSize = 1 * 148 + 1 * 34 + 10;
  const totalFeeInSatsOne = oneBlockRate * transactionSize;
  // console.log("totalFeeInSatsOne: ", totalFeeInSatsOne);
  const totalFeeInSatsThree = threeBlockRate * transactionSize;
  // console.log("totalFeeInSatsThree: ", totalFeeInSatsThree);
  const totalFeeInSatsSix = sixBlockRate * transactionSize;
  // console.log("totalFeeInSatsSix: ", totalFeeInSatsSix);
  const totalFeeInSatsTenth = tenthBlockRate * transactionSize;
  // console.log("totalFeeInSatsTenth: ", totalFeeInSatsTenth);

  // total fee is USD for transaction completion per block
  const totalFeeInUsdBlockOne = (totalFeeInSatsOne * priceBtc.price) / 10 ** 8;
  // console.log("totalFeeInUsdBlockOne: ", totalFeeInUsdBlockOne);
  const totalFeeInUsdBlockThree =
    (totalFeeInSatsThree * priceBtc.price) / 10 ** 8;
  // console.log("totalFeeInUsdBlockThree: ", totalFeeInUsdBlockThree);
  const totalFeeInUsdBlockSix = (totalFeeInSatsSix * priceBtc.price) / 10 ** 8;
  // console.log("totalFeeInUsdBlockSix: ", totalFeeInUsdBlockSix);
  const totalFeeInUsdBlockTenth =
    (totalFeeInSatsTenth * priceBtc.price) / 10 ** 8;
  // console.log("totalFeeInUsdBlockTenth: ", totalFeeInUsdBlockTenth);

  return {
    totalFeeInUsdBlockOne,
    totalFeeInUsdBlockThree,
    totalFeeInUsdBlockSix,
    totalFeeInUsdBlockTenth,
  };
}
