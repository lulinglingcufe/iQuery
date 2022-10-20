#! /usr/bin/env python3

import time
import sys
import concurrent.futures
import traceback
import random
from collections import Counter

def get_w3():
    from web3 import Web3, HTTPProvider
    from web3.middleware import geth_poa_middleware
    w3 = Web3(HTTPProvider("http://localhost:8545"))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    w3.eth.default_account = w3.eth.accounts[0]
    return w3


def pool_init():
    globals()['w3'] = get_w3()
    globals()['con'] = get_contract()


def deploy():
    assert w3.eth.block_number == 0
    resp = w3.eth.send_transaction({"data": open("compile/A.bin").read()})
    print(resp.hex())
    return resp


def get_contract():
    txn_hash = w3.eth.get_block(1)["transactions"][0]
    contract_address = w3.eth.get_transaction_receipt(txn_hash)["contractAddress"]
    contract = w3.eth.contract(contract_address, abi=open("compile/A.abi").read())
    return contract


def insert():
    start = int(sys.argv[2])
    stop = int(sys.argv[3])
    assert w3.eth.block_number == start + 1
    con = get_contract()
    for block in range(start, stop):
        print(block)
        user_names = [f"User_{block*200 + i}_@orgA.com" for i in range(200)]
        user_prices = [random.randint(1,5000) for i in range(200)]
        con.functions.addOrgUsers(user_names, "company", user_prices).transact()
        while w3.eth.block_number != block + 2:
            time.sleep(0.02)


def append():
    start = int(sys.argv[2])
    stop = int(sys.argv[3])
    assert w3.eth.block_number == start + 1
    con = get_contract()
    for block in range(start, stop):
        print(block)
        user_names = [f"User_{block*200 + i}_@orgB.com" for i in range(200)]
        con.functions.addOrgUsers(user_names, "supermarket").transact()
        while w3.eth.block_number != block + 2:
            time.sleep(0.02)

def get_size_inner(org):
    con = get_contract()
    res = con.functions.getOrgLength(org).call()
    return res

def get_size():
    org = sys.argv[2]
    res = get_size_inner(org)
    print(res)

def do(task):
    stop = min(task + g_batch_size, g_stop)
    return con.functions.getOrgUsers("company", task, stop).call()

def batch_do(tasks, workers):
    start = time.time()
    res = []
    executor = concurrent.futures.ProcessPoolExecutor(max_workers=workers, initializer=pool_init)
    futures = {executor.submit(do, task): task for task in tasks}
    for future in concurrent.futures.as_completed(futures):
        task = futures[future]
        try:
            data = future.result()
        except Exception:
            print(f"{task} {traceback.format_exc()}")
            raise
        else:
            #res.extend(data)
            for tp in data:
                res.append(tp[2])

            if len(res) % 100000 == 0:
                print(len(res), time.time() - start)
    return res

def batch_query():
    global g_batch_size, g_start, g_stop
    a = time.time()
    g = globals()
    g['g_batch_size'] = 1000
    g['g_start'] = int(sys.argv[2])
    g['g_stop'] = int(sys.argv[3])
    n_process = int(sys.argv[4])
    tasks = list(range(g_start, g_stop, g_batch_size))
    res = batch_do(tasks, n_process)
    res.sort()
    counter = Counter(res)
    print(counter)


    n_average = int(sys.argv[5])
    
    for num in range(1,n_average): 
        res = batch_do(tasks, n_process)
    b = time.time()
    print((b - a)/(n_average*1.0))

"""     b = time.time()
    print(b - a) """
    #print(res)
"""     price_sum = 0
    for tp in res:
         price_sum += tp[2]

    print(price_sum) """



"""     assert sorted(res) == sorted(
        (f'User_{i}_@orgA.com', 'company')
        for i in range(g_start, g_stop)
    ) """


def query():
    i = int(sys.argv[2])
    con = get_contract()
    print(con.functions.getOrgUsers("company", i, i+1).call())

if __name__ == "__main__":
    import sys
    func_name = sys.argv[1]
    g = globals()
    if func_name != "batch_query":
        g['w3'] = get_w3()
    g[func_name]()
