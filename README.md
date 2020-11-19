# Overview

iQuery project is an off-chain Layer for blockchain network in Hyperledger Fabric 1.4. We offer the block listener in [blocklistener  directory](/blocklistner) . We offer the benchmark script for baseline in [baseline directory](/baseline) . We offer the script in [experiment directory](/experiment ) . 

The chaincode for IoT payment network is in [contract directory](/blocklistner/src/contract/fabric/edu) 

---

# Architecture

iQuery apply **block listener** to receive blocks from a Fabric peer node with a valid certificate. Then iQuery employs a Merkle tree based multi-origin query to enable tamper evident query results from different organization domains. CouchDB supports Map-Reduce functions for conditional and temporal queries.

![image](</picture/architecture.GIF>)



# Quick Start

1.**Start the distributed Fabric network**：we have a cluster of IP 226,227,228,229,230

The network configuration is in [baseline directory](/baseline) 

```shell
230
cd /home/ubuntu/Lulingling/fabric-v1.4/2org1peercouchdb
docker-compose -f org1-230-couch.yaml up -d
229
cd /home/ubuntu/lulingling/fabric-v1.4/2org1peercouchdb
docker-compose -f org1-229-1.4.0.yaml up -d
228
cd /home/ubuntu/Lulingling/fabric-v1.4/2org1peercouchdb
docker-compose -f org2-228-1.4.0.yaml up -d
227 
cd /home/ubuntu/lulingling
docker-compose -f org2-227-couch.yaml up -d
226
cd /home/lingling/caliper/packages/caliper-samples/network/fabric-v1.4/2org1peercouchdb
docker-compose -f ca-orderer.yaml up -d

```

2.**Create mychannel**:

```shell
229
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/mychannel.tx

docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel fetch config -o orderer.example.com:7050 -c mychannel mychannel.block

docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer  channel join -b mychannel.block

228
docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com peer channel fetch config -o orderer.example.com:7050 -c mychannel mychannel.block

docker exec -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org2.example.com/msp" peer0.org2.example.com peer  channel join -b mychannel.block
```
