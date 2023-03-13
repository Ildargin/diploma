import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { Pool } from 'pg'
import cors from 'cors'

dotenv.config()

const app: Express = express()
const db = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
})
const port = process.env.PORT

app.use(cors())

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
    const dbRes = await db.query(
      `SELECT * FROM ethtxs WHERE txto='${address}' OR txfrom='${address}';`
    )
    result = dbRes.rows
  }
  res.send(result || { msg: `error happend ${JSON.stringify(req.query)}` })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
