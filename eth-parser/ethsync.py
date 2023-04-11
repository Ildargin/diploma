from os import environ, chmod
from web3 import Web3
from web3.middleware import geth_poa_middleware
import psycopg2
import time
import sys
import logging

dbname = "index"
startBlockFile = 'start_block.txt'
confirmationBlocks = "0"
nodeUrl = "http://127.0.0.1:3002"
pollingPeriod = "20"
logFile = "C:\\Users\\User\\Desktop\\DIPLOMA\\eth-parser\\logs.log"

try:
    with open(startBlockFile, 'r') as f:
        startBlock = f.read()
        if not startBlock.isdigit():
            raise ValueError('Invalid startBlock value')
except (FileNotFoundError, ValueError):
    startBlock = "2630083"
    with open(startBlockFile, 'w') as f:
        f.write(startBlock)

if dbname == None:
    print('Add postgre database in env var DB_NAME')
    exit(2)

if nodeUrl == None:
    print('Add eth url in env var ETH_URL')
    exit(2)

# Connect to Ethereum node
if nodeUrl.startswith("http"):
    web3 = Web3(Web3.HTTPProvider(nodeUrl)) 
elif nodeUrl.startswith("ws"):
    web3 = Web3(Web3.WebsocketProvider(nodeUrl)) 
else:
    web3 = Web3(Web3.IPCProvider(nodeUrl))

web3.middleware_onion.inject(geth_poa_middleware, layer=0)


logger = logging.getLogger("eth-sync")
logger.setLevel(logging.INFO)

if logFile == None:
    lfh = logging.StreamHandler()
else:
    lfh = logging.FileHandler(logFile)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
lfh.setFormatter(formatter)
logger.addHandler(lfh)

try:
    logger.info("Trying to connect to " + dbname + " database…")
    conn = psycopg2.connect(database=dbname)
    conn.autocommit = True
    logger.info("Connected to the database")
except:
    logger.error("Unable to connect to database")
    exit(1)


cur = conn.cursor()
cur.execute('DELETE FROM public.ethtxs WHERE block = (SELECT Max(block) from public.ethtxs)')
cur.close()
conn.close()


while web3.eth.syncing != False:
    logger.info("Waiting Ethereum node to be in sync…")
    time.sleep(300)

logger.info("Ethereum node is synced.")

def insertTxsFromBlock(block):
    blockid = block['number']
    time = block['timestamp']
    for txNumber in range(0, len(block.transactions)):
        trans = block.transactions[txNumber]
        try:
         transReceipt = web3.eth.getTransactionReceipt(trans['hash'])
        except:
         return 
        status = bool(transReceipt['status'])
        txhash = trans['hash'].hex()
        value = trans['value']
        inputinfo = trans['input']
        if (value == 0 and not inputinfo.startswith('0xa9059cbb')):
            continue
        fr = trans['from']
        to = trans['to']
        gasprice = trans['gasPrice']
        gas = transReceipt['gasUsed']
        contract_to = ''
        contract_value = ''
        if inputinfo.startswith('0xa9059cbb'):
            contract_to = inputinfo[10:-64]
            contract_value = inputinfo[74:]
        if len(contract_to) > 128:
            logger.info('Skipping ' + str(txhash) + ' tx. Incorrect contract_to length: ' + str(len(contract_to)))
            contract_to = ''
            contract_value = ''
        cur.execute(
            'INSERT INTO public.ethtxs(time, txfrom, txto, value, gas, gasprice, block, txhash, contract_to, contract_value, status) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (time, fr, to, value, gas, gasprice, blockid, txhash, contract_to, contract_value, status))

while True:
    try:
        conn = psycopg2.connect(database=dbname)
        conn.autocommit = True
    except:
        logger.error("Unable to connect to database")

    cur = conn.cursor()

    cur.execute('SELECT Max(block) from public.ethtxs')
    maxblockindb = cur.fetchone()[0]
    if maxblockindb is None:
        maxblockindb = int(startBlock)

    endblock = int(web3.eth.blockNumber) - int(confirmationBlocks)

    logger.info('Current best block in index: ' + str(maxblockindb) + '; in Ethereum chain: ' + str(endblock))

    for blockHeight in range(maxblockindb + 1, endblock):
        block = web3.eth.getBlock(blockHeight, True)
        infoMsg = None
        if len(block.transactions) > 0:
            insertTxsFromBlock(block)
            infoMsg = 'Block ' + str(blockHeight) + ' with ' + str(len(block.transactions)) + ' transactions is processed'
        else:
            infoMsg ='Block ' + str(blockHeight) + ' does not contain transactions'
        logger.info(infoMsg)
        print(infoMsg)

    # Write endBlock to file
    with open(startBlockFile, 'w') as f:
        f.write(str(endblock))
    
    cur.close()
    conn.close()
    time.sleep(int(pollingPeriod))
