import { gasUsdAvax } from "./scripts/avax";
import { gasUsdBsc } from "./scripts/bsc";
import { gasUsdBtc } from "./scripts/btc";
import { gasUsdBtcLtn } from "./scripts/btcLtn";
import { gasUsdEth } from "./scripts/eth";
import { gasUsdGala } from "./scripts/gala";
import { gasUsdPol } from "./scripts/pol";
import { gasUsdSol } from "./scripts/sol";
import { gasUsdTrx } from "./scripts/trx";
import { gasUsdXdc } from "./scripts/xdc";
import { gasUsdXrp } from "./scripts/xrp";

async function main() {
  const avaxGasUsd = await gasUsdAvax();
  console.log("avaxGasUsd: ", avaxGasUsd);
  const bscGasUsd = await gasUsdBsc();
  console.log("bscGasUsd: ", bscGasUsd);
  const gasEth = await gasUsdEth();
  console.log("gasEth: ", gasEth);
  const gasPol = await gasUsdPol();
  console.log("gasPol: ", gasPol);
  const gasTrx = await gasUsdTrx();
  console.log("gasTrx: ", gasTrx);
  const gasXdc = await gasUsdXdc();
  console.log("gasXdc: ", gasXdc);
  const gasXrp = await gasUsdXrp();
  console.log("gasXrp: ", gasXrp);
  const gasBtcLtn = await gasUsdBtcLtn();
  console.log("gasBtcLtn: ", gasBtcLtn);
  const gasBtc = await gasUsdBtc();
  console.log("gasBtc: ", gasBtc);
  const gasSol = await gasUsdSol();
  console.log("gasSol: ", gasSol);
  const gasGala = gasUsdGala();
  console.log("gasGala: ", gasGala);
}

main();
