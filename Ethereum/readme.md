```
./geth --dev --dev.gaslimit 900000000 --http --http.api eth,web3,personal,net,miner --ipcdisable --datadir chain_data
```

```
./geth attach http://localhost:8545
```

```
./solc --optimize --bin --abi -o compile --overwrite A.sol
```

Insert transaction to Ethereum：

```
python3 main.py deploy
python3 main.py insert 0 15  (start blocknumber -end blocknumber)
python3 main.py append 21 30
```

Query transaction from Ethereum：

```
python3  main.py  batch_query  1  2  16
(start transactionID-end transactionID, thread number)
```

We use 16 threads in benchmark because Ethereum has a gas limit for transaction excution.
