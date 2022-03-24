# Quick Start

We apply  [Hyperledger Caliper](https://github.com/hyperledger/caliper/)  to benchmark the basic distributed network as baseline. 

1.**Start the iot chaincode in Fabric network**：we perform the install iot chaincode  operation from 226.

```shell
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-iot.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-install

npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-iot.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-test

npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-iot-simple-owner.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-test

```

2.**Benchmark four native query operations**:

```shell
#GetHistoryForKey
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-query-getHistoryForiot.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-test
#GetState 
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-query-readiot.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-test
#GetStateByRange 
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-query-rangeiot.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-test
#GetQueryResult
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/iot/config-queryiotByOwner.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-iot-dis.yaml --caliper-flow-only-test

```