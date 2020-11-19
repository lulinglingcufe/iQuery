# Quick Start

We apply  [Hyperledger Caliper](https://github.com/hyperledger/caliper/)  to populate the basic distributed network with four types of education transactions. 

1.**Transaction Type: initUser**

```shell
#Transaction Type:initUser
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/configuser.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu.yaml --caliper-flow-skip-end

#Transaction model M1:
cd /home/lingling/fabric-samples-release-1.4/edu-off-chain/off_chain_data/
node edublockEventListener0302.js
```



2.**Transaction Type: initService**

```shell
#Transaction Type:initService
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/configservice.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu.yaml --caliper-flow-only-test

#Transaction model M1:
cd /home/lingling/fabric-samples-release-1.4/edu-off-chain/off_chain_data/
node edublockEventListener0302.js
```



3.**Transaction Type: rechargeToken**

```shell
#Transaction Type:rechargeToken
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/configUserRecharge.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu.yaml --caliper-flow-only-test

#Transaction model M2:
cd /home/lingling/fabric-samples-release-1.4/edu-off-chain/off_chain_data/
node edublockEventListener0302.js
```



4.**Transaction Type: consumeService**

```shell
#Transaction Type:consumeService
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/configUserConsumeService.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu.yaml --caliper-flow-only-test


#Transaction model M3:
cd /home/lingling/fabric-samples-release-1.4/edu-off-chain/off_chain_data/
node edublockEventListener0303consume.js
```

**You are able to see the output**:

```shell
ProcessBlock time: 90.551ms
value: %v 0
value: %v 0
value: %v 0
value: %v 0
value: %v 0
value: %v 0
value: %v 0
value: %v 0
value: %v 0
value: %v 0
ProcessBlock time: 88.731ms
value: %v 0
```



