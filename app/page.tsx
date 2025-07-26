import { Suspense } from "react"
import PodsTable from "@/components/pods-table"
import { Loader2, Cpu } from "lucide-react"

// Mock data for UI demonstration
const mockPods = [
  {
    name: "nginx-deployment-7d8b49557f-x2k9m",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "2d",
    node: "worker-node-1",
    ip: "10.244.1.15",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    cpu: "250m",
    memory: "512Mi",
  },
  {
    name: "redis-master-6b8b4f4c4-9h7k2",
    namespace: "cache",
    status: "Running",
    ready: "1/1",
    restarts: 1,
    age: "5h",
    node: "worker-node-2",
    ip: "10.244.2.8",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    cpu: "100m",
    memory: "256Mi",
  },
  {
    name: "postgres-db-5f7b8c9d-3m4n5",
    namespace: "database",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "1d",
    node: "worker-node-1",
    ip: "10.244.1.22",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    cpu: "500m",
    memory: "1Gi",
  },
  {
    name: "api-server-deployment-8k9l-p6q7r",
    namespace: "api",
    status: "Pending",
    ready: "0/1",
    restarts: 3,
    age: "10m",
    node: "worker-node-3",
    ip: "",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    cpu: "0",
    memory: "0",
  },
  {
    name: "frontend-app-deployment-xyz123",
    namespace: "frontend",
    status: "Running",
    ready: "2/2",
    restarts: 0,
    age: "3h",
    node: "worker-node-2",
    ip: "10.244.2.15",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    cpu: "300m",
    memory: "768Mi",
  },
  {
    name: "monitoring-prometheus-abc456",
    namespace: "monitoring",
    status: "Failed",
    ready: "0/1",
    restarts: 5,
    age: "1h",
    node: "worker-node-1",
    ip: "",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    cpu: "0",
    memory: "0",
  },
  {
    name: "auth-service-def789",
    namespace: "auth",
    status: "Running",
    ready: "3/3",
    restarts: 0,
    age: "6h",
    node: "worker-node-3",
    ip: "10.244.3.12",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    cpu: "150m",
    memory: "384Mi",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated starfield background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Galaxy overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-cyan-900/20"></div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/20">
              <Cpu className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-mono animated-gradient-text">KUBERNETES CLUSTER</h1>
              <p className="text-slate-400 font-mono text-sm tracking-wider">{">"} NEURAL NETWORK INTERFACE v2.1.0</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </header>

        <Suspense fallback={<LoadingState />}>
          <PodsTable pods={mockPods} />
        </Suspense>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-4 text-cyan-400">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
        </div>
        <div className="font-mono">
          <div className="text-lg">INITIALIZING NEURAL LINK...</div>
          <div className="text-sm text-slate-400 animate-pulse">Scanning cluster nodes</div>
        </div>
      </div>
    </div>
  )
}
