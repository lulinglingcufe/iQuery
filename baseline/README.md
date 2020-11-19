# Quick Start

We apply  [Hyperledger Caliper](https://github.com/hyperledger/caliper/)  to benchmark the basic distributed network as baseline. 

1.**Start the edu chaincode in Fabric network**：we perform the install edu chaincode  operation from 226.

```shell
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-edu.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-install

npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-edu.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-test

npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-edu-simple-owner.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-test

```

2.**Benchmark four native query operations**:

```shell
#GetHistoryForKey
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-query-getHistoryForedu.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-test
#GetState 
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-query-readedu.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-test
#GetStateByRange 
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-query-rangeedu.yaml --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-test
#GetQueryResult
npx caliper benchmark run --caliper-workspace . --caliper-benchconfig benchmark/edu/config-queryeduByOwner.yaml  --caliper-networkconfig network/fabric-v1.4/2org1peercouchdb/fabric-go-edu-dis.yaml --caliper-flow-only-test

```