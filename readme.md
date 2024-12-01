- I have created the scripts for finding the transaction cost in USD for transferring 1 USDT on
  various blockchains. The scripts are given under "scripts" folder. You can use the scripts in any file by calling the method name which is exported from each script file. Example is given in "main.js"

- Steps to follow:
- clone the repo
- run "npm install"
- run "node main.js"

### Transaction cost in different Blockchains

#### Eth, Bsc, Pol and Avax

They have the same logic for transaction cost. We need to find the gas price for each units and then find the number of gas units required for a trasanction. For Eth, Bnb and Pol the gas price has 3 categories as Safe Gas Price, Propose Gas Price and Fast Gas Price which means low, avg and high respectively. But in Avax only avg gas price is there. Multiplying the gas price with number of gas units will give total gas cost in native coin. Fetch the USD price per native coin and can find the gas price in USD.

#### Tron

This chain has a concept of energy instead of gas in other EVM chains. Rest is same as other EVM chains. Find the units of energy required for the transaction and energy unit price. Upon finding the total energy price we can fetch the USD price per TRX and find the total cost in USD.

#### XDC

XDC is same as above EVM chains. Slow, Avg and Fast gas price along with usd price for XDC will be returned from explorer stats. Compute the gas units required for the transaction and the remaining calculations are same.

#### XRP

Ripple chain has a concept of load local cost and open ledger cost.

- load local cost is the minimum txn fee required so that the txn will not revert.
- open ledger cost is the txn fee so that the txn will get added to the current ledger.

#### SOL

Solana blockchain has almost fixed transaction cost at the moment. Its like 5000 lamports per signature. If the transction required 2 signatures; then the cost will be 10000 lamports and so on. It also has the concept of Compute Units (CU) per transaction. We can find the compute units required for the transaction and unit price and we can add that as priority fee. But right now it has no major effect on transaction fee. But we can keep it as a maximum transaction fee. We can set the compute unit price. But on an average we can take it as 10 lamports.

- So the fee will be 5000 \* number of transactions (currently only this is applicable).
- additional fee of compute unit \* compute unite price (no much effects but can be kept as priorit fee)

### BTC

Transaction fees on Bitcoin are mostly determined by two factors:

- The “size,” or data volume of the transaction.
- Users’ demand for block space. The faster a user wants their transaction confirmed, the more fees they will be willing to pay (generally).
- So the txn fee will be "fee rate per bytes" \* "number of bytes in a transaction".
- Number of bytes in a transaction can be calculated as follows:
  - Inputs: For each input, legacy transactions use around 148 bytes and SegWit transactions use around 68 bytes.
  - Outputs: Each output generally takes 34 bytes.
  - Overhead: There is a small overhead of approximately 10 bytes for the entire transaction.
  - Example Formula (Legacy Transaction):
    - Size = (Number of Inputs × 148) + (Number of Outputs × 34 ) + 10
    - For a single-input, two-output transaction, this would be:
    - Size = (1×148) + (2×34) + 10 = 226 bytes

### BTC Lightning

- Bitcoing lightning network has a different logic. This has no gas logic. But a percentage of transaction amount is charged by the payment channels. In Lightning network for each transaction a channel has to be created from sender to receiver. But this is not practical.
- So some routing channels helps to do this transaction by accepting a fee for routing our transactions. Fees on the lightning network are applied on a per-peer and per-channel basis. Every peer can set their fee policies for all their channels. These fees apply to the outgoing channel capital when making a payment, meaning that as a payment is sent from your node to a neighboring node, a fee can be charged by you. Fees are only charged in case of a successful payment because every node in the path can only redeem the fees if the receiver sends confirmation that the payment went through.
- Currently, two types of lightning network fees can be charged.
  - First one is the base fee; this fee is a fixed amount charged by payment routed. A one satoshi base fee will be charged for every payment routed.
  - Second one is the Fee rate; this fee is usually expressed in parts per million (ppm). A node with a 1 ppm fee rate will charge 1 satoshi per every 1M satoshis moved through the channel.
- Minimum Fee
  There is no absolute "network-enforced" minimum fee on the Lightning Network. However, in practice:
  Most nodes set a low base fee, often around 1 satoshi or 1 millisatoshi (0.001 satoshis) for smaller transactions.
- Max fee
  Technically, there’s also no enforced "maximum" fee that a node can set. However:
  Extremely high fees could discourage others from using the node as a route, so most operators keep fees reasonable to remain competitive.
- Some common practices:
  - Base Fee: Typically in the range of 1–1000 millisatoshis.
  - Fee Rate: Commonly set between 0 and 1000 ppm (parts per million), where 1000 ppm equates to 0.1% of the amount being routed.

#### GALA

- Gala chain has proposed a transaction fee of 2 to 4 cents for token tranafer. For batch minting of 400 NFTs the
  transaction cost will be 1GALA.
