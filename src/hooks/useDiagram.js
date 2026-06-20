import { useState, useCallback } from 'react'

// Map component name keywords → node type used in DiagramCanvas
const COMPONENT_MAP = {
  client: 'client',
  browser: 'client',
  mobile: 'client',
  user: 'client',
  'load balancer': 'loadBalancer',
  'load-balancer': 'loadBalancer',
  lb: 'loadBalancer',
  'api gateway': 'apiGateway',
  gateway: 'apiGateway',
  'web server': 'webServer',
  server: 'webServer',
  backend: 'webServer',
  'database (sql)': 'databaseSQL',
  'sql database': 'databaseSQL',
  postgres: 'databaseSQL',
  mysql: 'databaseSQL',
  rds: 'databaseSQL',
  'database (nosql)': 'databaseNoSQL',
  'nosql database': 'databaseNoSQL',
  mongodb: 'databaseNoSQL',
  cassandra: 'databaseNoSQL',
  dynamodb: 'databaseNoSQL',
  'cache (redis)': 'cache',
  cache: 'cache',
  redis: 'cache',
  memcached: 'cache',
  'message queue': 'queue',
  queue: 'queue',
  kafka: 'queue',
  rabbitmq: 'queue',
  sqs: 'queue',
  cdn: 'cdn',
  cloudfront: 'cdn',
  's3': 'storage',
  storage: 'storage',
  'blob storage': 'storage',
  microservice: 'microservice',
  service: 'microservice',
  'auth service': 'auth',
  'authentication service': 'auth',
  authentication: 'auth',
  auth: 'auth',
}

// Positions arranged in a loose left-to-right architecture layout
const POSITIONS = [
  { x: 50,  y: 180 },
  { x: 220, y: 80  },
  { x: 220, y: 280 },
  { x: 400, y: 80  },
  { x: 400, y: 200 },
  { x: 400, y: 320 },
  { x: 580, y: 80  },
  { x: 580, y: 200 },
  { x: 580, y: 320 },
  { x: 760, y: 150 },
  { x: 760, y: 300 },
  { x: 940, y: 200 },
]

function resolveType(name) {
  const lower = name.toLowerCase()
  for (const [key, type] of Object.entries(COMPONENT_MAP)) {
    if (lower.includes(key)) return type
  }
  return 'microservice'
}

export function useDiagram() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const seenRef = { current: new Set() }

  // Keep seenRef stable across renders by storing it outside state
  const [seen] = useState(() => new Set())

  const addComponent = useCallback((componentName) => {
    const type = resolveType(componentName)
    const key = type + ':' + componentName.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)

    const posIndex = seen.size - 1
    const position = POSITIONS[posIndex % POSITIONS.length]

    const newNode = {
      id: `node-${key}`,
      type: 'architectureNode',
      position,
      data: { label: componentName, componentType: type },
    }

    setNodes(prev => {
      const updated = [...prev, newNode]

      // Auto-connect to the previous node with an edge
      if (updated.length > 1) {
        const prevNode = updated[updated.length - 2]
        const edgeId = `${prevNode.id}->${newNode.id}`
        setEdges(e => [
          ...e,
          {
            id: edgeId,
            source: prevNode.id,
            target: newNode.id,
            animated: true,
            style: { stroke: '#ff9900', strokeWidth: 2 },
          },
        ])
      }

      return updated
    })
  }, [seen])

  const onNodesChange = useCallback((changes) => {
    setNodes(prev => {
      return prev.map(node => {
        const change = changes.find(c => c.id === node.id)
        if (change?.type === 'position' && change.position) {
          return { ...node, position: change.position }
        }
        return node
      })
    })
  }, [])

  const resetDiagram = useCallback(() => {
    setNodes([])
    setEdges([])
    seen.clear()
  }, [seen])

  return { nodes, edges, addComponent, onNodesChange, resetDiagram }
}
