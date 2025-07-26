"use client"

import { X, Server, Cpu, HardDrive, Network, Clock, Zap, Activity, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Pod {
  name: string
  namespace: string
  status: string
  ready: string
  restarts: number
  age: string
  node: string
  ip: string
  createdAt: string
  cpu: string
  memory: string
}

interface PodDetailsPanelProps {
  pod: Pod
  onClose: () => void
}

// Mock detailed data
const getMockDetails = (pod: Pod) => ({
  ...pod,
  labels: {
    app: "nginx",
    version: "v1.0.0",
    environment: "production",
    tier: "frontend",
  },
  containers: [
    {
      name: "nginx",
      image: "nginx:1.21.0",
      ready: true,
      restartCount: 0,
      state: "running",
      ports: ["80/TCP", "443/TCP"],
    },
    {
      name: "sidecar",
      image: "envoy:v1.18.0",
      ready: true,
      restartCount: 0,
      state: "running",
      ports: ["8080/TCP"],
    },
  ],
  events: [
    {
      type: "Normal",
      reason: "Scheduled",
      message: `Successfully assigned ${pod.namespace}/${pod.name} to ${pod.node}`,
      timestamp: "2m ago",
    },
    {
      type: "Normal",
      reason: "Pulled",
      message: 'Container image "nginx:1.21.0" already present on machine',
      timestamp: "2m ago",
    },
    {
      type: "Normal",
      reason: "Created",
      message: "Created container nginx",
      timestamp: "2m ago",
    },
    {
      type: "Normal",
      reason: "Started",
      message: "Started container nginx",
      timestamp: "2m ago",
    },
  ],
  metrics: {
    cpuUsage: "45%",
    memoryUsage: "67%",
    networkIn: "1.2 MB/s",
    networkOut: "0.8 MB/s",
  },
})

export default function PodDetailsPanel({ pod, onClose }: PodDetailsPanelProps) {
  const details = getMockDetails(pod)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return "from-emerald-500/20 to-emerald-600/20 border-emerald-500/50 text-emerald-400"
      case "pending":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50 text-yellow-400"
      case "failed":
        return "from-red-500/20 to-red-600/20 border-red-500/50 text-red-400"
      default:
        return "from-slate-500/20 to-slate-600/20 border-slate-500/50 text-slate-400"
    }
  }

  return (
    <div className="w-1/3 animate-slide-in-right">
      <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-slate-800/50 to-purple-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30">
                <Server className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-mono">NEURAL NODE</h2>
                <p className="text-xs text-slate-400 font-mono">DETAILED ANALYSIS</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-red-500/20 border border-red-500/30"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Pod Name & Status */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider">Pod Identity</p>
              <p className="text-white font-mono text-sm break-all">{pod.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`bg-gradient-to-r ${getStatusColor(pod.status)} border font-mono shadow-lg`}>
                {pod.status}
              </Badge>
              <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50 font-mono">
                {pod.namespace}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto h-[calc(100%-200px)] custom-scrollbar">
          {/* Metrics */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-purple-800/20 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                SYSTEM METRICS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-slate-400 font-mono">CPU</span>
                  </div>
                  <div className="text-cyan-400 font-mono text-lg">{details.metrics.cpuUsage}</div>
                  <div className="w-full bg-slate-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-slate-400 font-mono">MEMORY</span>
                  </div>
                  <div className="text-purple-400 font-mono text-lg">{details.metrics.memoryUsage}</div>
                  <div className="w-full bg-slate-700 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-1 rounded-full"
                      style={{ width: "67%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Network className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-slate-400 font-mono">NET IN</span>
                  </div>
                  <div className="text-emerald-400 font-mono text-sm">{details.metrics.networkIn}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Network className="w-3 h-3 text-pink-400" />
                    <span className="text-xs text-slate-400 font-mono">NET OUT</span>
                  </div>
                  <div className="text-pink-400 font-mono text-sm">{details.metrics.networkOut}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-purple-800/20 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                <Server className="w-4 h-4" />
                SYSTEM INFO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 font-mono text-xs">READY</p>
                  <p className="text-emerald-400 font-mono">{pod.ready}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono text-xs">RESTARTS</p>
                  <p className={`font-mono ${pod.restarts > 0 ? "text-yellow-400" : "text-slate-300"}`}>
                    {pod.restarts}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono text-xs">AGE</p>
                  <p className="text-slate-300 font-mono">{pod.age}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-mono text-xs">NODE</p>
                  <p className="text-slate-300 font-mono text-xs">{pod.node}</p>
                </div>
              </div>
              {pod.ip && (
                <div className="pt-2 border-t border-slate-700">
                  <p className="text-slate-400 font-mono text-xs">POD IP</p>
                  <p className="text-cyan-400 font-mono text-sm bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30 mt-1">
                    {pod.ip}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Containers */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-purple-800/20 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                CONTAINERS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {details.containers.map((container, index) => (
                <div
                  key={container.name}
                  className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-white text-sm">{container.name}</span>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${container.ready ? "bg-emerald-400" : "bg-red-400"} animate-pulse`}
                      ></div>
                      <span className={`text-xs font-mono ${container.ready ? "text-emerald-400" : "text-red-400"}`}>
                        {container.ready ? "ONLINE" : "OFFLINE"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-slate-400 font-mono">
                      Image: <span className="text-slate-300">{container.image}</span>
                    </p>
                    <p className="text-slate-400 font-mono">
                      Ports: <span className="text-cyan-400">{container.ports.join(", ")}</span>
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Labels */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-purple-800/20 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                LABELS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(details.labels).map(([key, value], index) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded bg-slate-700/30 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="font-mono text-xs text-slate-400">{key}</span>
                    <span className="font-mono text-xs text-white">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card className="bg-gradient-to-br from-slate-800/30 to-purple-800/20 border-cyan-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 font-mono text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                EVENT LOG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {details.events.map((event, index) => (
                  <div
                    key={index}
                    className="p-2 rounded bg-slate-700/30 border-l-2 border-emerald-500/50 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-emerald-400">{event.reason}</span>
                      <span className="font-mono text-xs text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono">{event.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
