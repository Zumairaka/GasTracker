export type RequestOption = {
  method: string;
  headers: Headers;
  body: string;
  redirect: RequestRedirect;
};

export type EthReturn = {
  gasMinUsd: number;
  gasAvgUsd: number;
  gasMaxUsd: number;
};

export type BtcReturn = {
  totalFeeInUsdBlockOne: number;
  totalFeeInUsdBlockThree: number;
  totalFeeInUsdBlockSix: number;
  totalFeeInUsdBlockTenth: number;
};

export type BtcLtnReturn = {
  totalMinFeeUsd: number;
  totalMaxFeeUsd: number;
};

export type GalaReturn = {
  minFeeUsd: number;
  maxFeeUsd: number;
};

export type SolReturn = {
  minTxnCostUsd: number;
  avgTxnCostUsd: number;
  maxTxnCostUsd: number;
};

export type XrpReturn = {
  loadLocalCostUsd: number;
  openLedgerCostUsd: number;
};
