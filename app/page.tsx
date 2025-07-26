import { Suspense } from "react"
import PodsTable from "../components/pods-table"
import { Loader2, Cpu } from "lucide-react"
import { getPods } from "../lib/actions"


export default async function HomePage() {
  
  const pods = await getPods()

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
          <PodsTable pods={pods} />
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
