// GALA chain has proposed the transaction fees for various on chain activities.
// token transfer will be 2 to 4 cents
// batch minting will be 1GALA

export function gasUsdGala() {
  const minFeeUsd = 0.02;
  const maxFeeUsd = 0.04;
  return { minFeeUsd, maxFeeUsd };
}