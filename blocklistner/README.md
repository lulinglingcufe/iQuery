# Quick Start

We apply  [Hyperledger Caliper](https://github.com/hyperledger/caliper/)  to populate the basic distributed network with four types of IoT  transactions. 

1.**Transaction Type: initUser**

```shell
#Transaction Type:initUser
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/configuser.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot.yaml --caliper-flow-skip-end

cd /home/local-user-name/fabric-samples-release-1.4/iot-off-chain/off_chain_data/
node iotblockEventListener0302.js
```



2.**Transaction Type: initcommodity**

```shell
#Transaction Type:initCommodity
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/configcommodity.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot.yaml --caliper-flow-only-test

cd /home/local-user-name/fabric-samples-release-1.4/iot-off-chain/off_chain_data/
node iotblockEventListener0302.js
```



3.**Transaction Type: rechargeToken**

```shell
#Transaction Type:rechargeToken
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/configUserRecharge.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot.yaml --caliper-flow-only-test

#Transaction model M2:
cd /home/local-user-name/fabric-samples-release-1.4/iot-off-chain/off_chain_data/
node iotblockEventListener0302.js
```



4.**Transaction Type: consumecommodity**

```shell
#Transaction Type:consumecommodity
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/configUserConsumecommodity.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot.yaml --caliper-flow-only-test


#Transaction model M3:
cd /home/local-user-name/fabric-samples-release-1.4/iot-off-chain/off_chain_data/
node iotblockEventListener0303consume.js
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



