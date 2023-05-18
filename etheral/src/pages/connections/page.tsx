import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import type { GraphData, GraphEvents } from 'react-vis-graph-wrapper'
import { Tx, getPath } from '@api'
import {
  concatGraphs,
  fetchTxById,
  fetchTxsByUserId,
  getGraphFromTxs,
  getUniqueTxAddresses,
} from '@api'
import { AddressWidget, Button, Container, Graph, Input, Loading, TxWidget } from '@components'
import './page.scss'

export const Connections = () => {
  const searchController = useRef<AbortController | null>(null)
  const [params, setParams] = useState({
    address1: '',
    address2: '',
    maxDepth: 3,
    nodeTrashnold: 50,
  })
  const { id = '' } = useParams()
  const [lastClickedNode, setLastClickedNode] = useState('')
  const [edgeTx, setEdgeTx] = useState<Tx>()
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] })
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [displayTrashhold, setDisplayTrashhold] = useState('100')
  const [trashholdMessage, setTrashholdMessage] = useState('')

  const fetchTxInfo = useCallback(async (address: number) => {
    const tx = await fetchTxById(address)
    setEdgeTx(tx)
  }, [])

  const fetchAndUpdateGraph = useCallback(
    async (address: string) => {
      const txs = await fetchTxsByUserId(address)
      if (getUniqueTxAddresses(txs).length > Number(displayTrashhold)) {
        setTrashholdMessage(`Node txs(${txs.length}) is too big for display!`)
        return
      }
      setTrashholdMessage('')
      setGraph((graph) => concatGraphs(graph, getGraphFromTxs(txs, id, address)))
    },
    [displayTrashhold, id],
  )

  useEffect(() => {
    const address = lastClickedNode || id
    if (address) {
      setParams((old) => ({ ...old, address1: address }))
      fetchAndUpdateGraph(address)
    }
  }, [id, fetchAndUpdateGraph, displayTrashhold])

  const events: GraphEvents = {
    select: async function (event: { nodes?: []; edges?: [] }) {
      const edge = event.edges?.at(0)
      const node = event.nodes?.at(0)
      if (node) {
        setLastClickedNode(node)
        setTrashholdMessage('')
        fetchAndUpdateGraph(node)
      }
      if (edge) {
        fetchTxInfo(edge)
      }
    },
  }

  const onSearchClick = () => {
    const controller = new AbortController()
    searchController.current = controller
    setIsSearchLoading(true)
    getPath(params, controller)
      .then((pathArr) => {
        const pathsGraph = getGraphFromTxs(pathArr.flat(), params.address1, params.address2)
        const unitedGraph = concatGraphs(graph, pathsGraph)
        setGraph(unitedGraph)
      })
      .finally(() => {
        searchController.current = null
        setIsSearchLoading(false)
      })
  }

  const onBreakClick = () => {
    if (searchController.current) {
      searchController.current.abort()
    }
  }

  return (
    <div className="graph-container">
      <Graph graph={graph} events={events} />
      <section className="connections">
        <Container className="connections-params">
          <h4>Search parameters</h4>
          <div className="connections-params-row">
            <Input
              value={params.address1}
              placeholder="address1"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setParams((old) => ({ ...old, address1: e.target.value }))
              }
            />
            <span>&</span>
            <Input
              value={params.address2}
              placeholder="address2"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setParams((old) => ({ ...old, address2: e.target.value }))
              }
            />
          </div>
          <div className="connections-params-row">
            <span>
              Node connections trashhold (if there are more connections, then the node will not be
              processed):
            </span>
            <Input
              value={String(params.nodeTrashnold)}
              type="number"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setParams((old) => ({ ...old, nodeTrashnold: Number(e.target.value) }))
              }
            />
          </div>
          <div className="connections-params-row">
            <span>Maximum depth (nodes on path):</span>
            <Input
              type="number"
              value={String(params.maxDepth)}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setParams((old) => ({ ...old, maxDepth: Number(e.target.value) }))
              }
            />
          </div>
          <div className="connections-button-container">
            <div className="connections-buttons">
              <Button onClick={onSearchClick} disabled={isSearchLoading}>
                SEARCH
              </Button>
              {isSearchLoading && <Button onClick={onBreakClick}>Abort</Button>}
            </div>
            <div className="search-loading">{isSearchLoading && <Loading />}</div>
          </div>
        </Container>
        <Container className="connections-params">
          <div>
            <span> Display nodes trashhold for 1 node</span>
            <br />
            <span>total displayed: {graph.nodes.length}</span>
          </div>
          <div>
            <Input
              value={displayTrashhold}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayTrashhold(e.target.value)}
            />
          </div>
        </Container>
        <AddressWidget address={lastClickedNode || id} />
        <TxWidget tx={edgeTx} />
        {trashholdMessage && (
          <Container>
            <span>{trashholdMessage}</span>
          </Container>
        )}
      </section>
    </div>
  )
}
