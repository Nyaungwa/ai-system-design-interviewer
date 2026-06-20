import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  FiMonitor, FiServer, FiDatabase, FiShield, FiBox,
  FiZap, FiGlobe, FiCpu, FiHardDrive, FiActivity,
} from 'react-icons/fi'
import { SiRedis, SiApachekafka } from 'react-icons/si'

// Icon + colour config per component type
const NODE_CONFIG = {
  client:        { icon: FiMonitor,     color: '#60a5fa', label: 'Client'         },
  loadBalancer:  { icon: FiActivity,    color: '#a78bfa', label: 'Load Balancer'  },
  apiGateway:    { icon: FiGlobe,       color: '#34d399', label: 'API Gateway'    },
  webServer:     { icon: FiServer,      color: '#fb923c', label: 'Web Server'     },
  databaseSQL:   { icon: FiDatabase,    color: '#f472b6', label: 'SQL Database'   },
  databaseNoSQL: { icon: FiDatabase,    color: '#fbbf24', label: 'NoSQL Database' },
  cache:         { icon: SiRedis,       color: '#f87171', label: 'Cache'          },
  queue:         { icon: SiApachekafka, color: '#818cf8', label: 'Message Queue'  },
  cdn:           { icon: FiZap,         color: '#2dd4bf', label: 'CDN'            },
  storage:       { icon: FiHardDrive,   color: '#94a3b8', label: 'Storage'        },
  microservice:  { icon: FiBox,         color: '#2563eb', label: 'Microservice'   },
  auth:          { icon: FiShield,      color: '#4ade80', label: 'Auth Service'   },
}

function ArchitectureNode({ data }) {
  const cfg = NODE_CONFIG[data.componentType] || NODE_CONFIG.microservice
  const Icon = cfg.icon

  return (
    <div
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border animate-fade-in cursor-grab"
      style={{
        background: '#111827',
        borderColor: cfg.color + '66',
        boxShadow: `0 0 12px ${cfg.color}33`,
        minWidth: 90,
      }}
    >
      <Icon style={{ color: cfg.color, fontSize: 22 }} />
      <span className="text-white text-xs font-medium text-center leading-tight" style={{ maxWidth: 80 }}>
        {data.label}
      </span>
    </div>
  )
}

const nodeTypes = { architectureNode: ArchitectureNode }

export default function DiagramCanvas({ nodes, edges, onNodesChange }) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10" style={{ background: '#0d1224' }}>
      {nodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-white/20 select-none">
          <FiCpu className="text-5xl mb-3" />
          <p className="text-sm">Architecture diagram builds here</p>
          <p className="text-xs mt-1">Mention components like "load balancer", "Redis cache", "database"…</p>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          nodesDraggable
          elementsSelectable
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1a2236" />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              const cfg = NODE_CONFIG[n.data?.componentType]
              return cfg ? cfg.color : '#2563eb'
            }}
            maskColor="rgba(10,14,26,0.7)"
          />
        </ReactFlow>
      )}
    </div>
  )
}
