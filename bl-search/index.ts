import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { Pool, QueryResult } from 'pg'
import cors from 'cors'

dotenv.config()

const app: Express = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT
const db = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
})

type Tx = {
  id: number
  txfrom: string
  txto: string
  txhash: string
}

const getAllAddressTx = (address: string): Promise<QueryResult<Tx>> =>
  db.query(
    `SELECT * FROM ethtxs WHERE txto='${address}' OR txfrom='${address}';`
  )

app.get('/size', async (req: Request, res: Response) => {
  const result = await db.query('SELECT COUNT(*) FROM ethtxs;')
  res.send(result.rows[0].count)
})

app.get('/tx', async (req: Request, res: Response) => {
  const address = req.query.address
  const search = req.query.search
  let result = null
  if (search) {
    const dbRes = await db.query(`SELECT * FROM ethtxs WHERE id=${search};`)
    result = dbRes.rows.at(0)
  }
  if (address) {
    const dbRes = await getAllAddressTx(String(address))
    result = dbRes.rows
  }
  res.send(result || { msg: `error happend ${JSON.stringify(req.query)}` })
})

app.post('/txpath', async (req: Request, res: Response) => {
  const address1 = String(req.body.address1)
  const address2 = String(req.body.address2)
  const maxDepth = Number(req.body.maxDepth) || 2
  const trashhold = Number(req.body.nodeTrashnold) || 50

  if (!address1 || !address2) {
    throw new Error('No params')
  }

  const usedAddresses = new Set<string>()
  const getNewAddresses = (
    rows: Tx[],
    usedAddresses: Set<string>,
    path: Tx[]
  ) =>
    rows.reduce((acc: { address: string; path: Tx[] }[], row) => {
      if (!usedAddresses.has(row.txfrom)) {
        return acc.concat({
          path: path.concat(row),
          address: row.txfrom,
        })
      }
      if (!usedAddresses.has(row.txto)) {
        return acc.concat({
          path: path.concat(row),
          address: row.txto,
        })
      }
      return acc
    }, [])
  const findConnection = (rows: Tx[], address: string) => {
    const connected: Tx[] = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const connectionArr = [row.txfrom, row.txto]
      if (connectionArr.includes(address)) {
        connected.push(row)
      }
    }
    return connected
  }

  let depth = 0
  const queue: { address: string; path: Tx[] }[][] = [
    [{ address: address1, path: [] as Tx[] }],
  ]
  const answer: Tx[][] = []

  while (queue.length > 0) {
    const element = queue.shift()
    if (!element || element.length === 0 || depth >= maxDepth) {
      break
    }
    //console.log(`nodes:${element.length} depth: ${depth}`)
    let newAddressesArr: { address: string; path: Tx[] }[] = []
    for (const { address, path } of element) {
      const { rows } = await getAllAddressTx(address)
      usedAddresses.add(address)
      if (rows.length > trashhold) {
        continue
      }
      const connections = findConnection(rows, address2)
      const newAddresses = getNewAddresses(rows, usedAddresses, path)
      console.log(` ${newAddresses.length} new addresses for ${address}`)
      if (connections.length > 0) {
        answer.push(path.concat(connections))
      }
      if (newAddresses.length > 0) {
        newAddressesArr = newAddressesArr.concat(newAddresses)
      }
    }
    if (newAddressesArr.length > 0) {
      queue.push(newAddressesArr)
    }
    depth++
  }
  res.send(answer)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
