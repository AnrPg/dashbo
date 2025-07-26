"use client"

import { useState, useMemo } from "react"
import { ChevronUp, ChevronDown, Search, Zap, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import PodDetailsPanel from "./pod-details-panel"

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

interface PodsTableProps {
  pods: Pod[]
}

type SortField = keyof Pod
type SortDirection = "asc" | "desc"

export default function PodsTable({ pods }: PodsTableProps) {
  const [selectedPod, setSelectedPod] = useState<Pod | null>(null)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredAndSortedPods = useMemo(() => {
    const filtered = pods.filter((pod) => {
      const matchesSearch =
        pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pod.namespace.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || pod.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })

    return filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle numeric fields
      if (sortField === "restarts") {
        aValue = a.restarts
        bValue = b.restarts
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [pods, searchTerm, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return (
          <div className="relative">
            <div className="working-robot">
              <div className="robot-body"></div>
              <div className="robot-head"></div>
              <div className="robot-antenna"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse-glow"></div>
          </div>
        )
      case "pending":
        return (
          <div className="relative">
            <div className="sleeping-robot">
              <div className="robot-body sleeping"></div>
              <div className="robot-head sleeping"></div>
              <div className="sleep-zzz">z</div>
            </div>
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse"></div>
          </div>
        )
      case "failed":
        return (
          <div className="relative">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping"></div>
          </div>
        )
      default:
        return <Zap className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-yellow-500/20"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/50 shadow-red-500/20"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50"
    }
  }

  const getReadyColor = (ready: string) => {
    const [current, total] = ready.split("/").map(Number)
    if (current === total && current > 0) {
      return "text-emerald-400"
    } else if (current > 0) {
      return "text-yellow-400"
    }
    return "text-red-400"
  }

  const getAgeColor = (age: string) => {
    // Extract numeric value and unit
    const match = age.match(/^(\d+)([dhm])$/)
    if (!match) return "text-slate-300"

    const value = Number.parseInt(match[1])
    const unit = match[2]

    // Convert to minutes for comparison
    let totalMinutes = 0
    if (unit === "m") totalMinutes = value
    else if (unit === "h") totalMinutes = value * 60
    else if (unit === "d") totalMinutes = value * 24 * 60

    // Color based on age
    if (totalMinutes < 60) return "text-emerald-400" // < 1 hour - very fresh
    if (totalMinutes < 360) return "text-cyan-400" // < 6 hours - fresh
    if (totalMinutes < 1440) return "text-yellow-400" // < 1 day - getting old
    if (totalMinutes < 10080) return "text-orange-400" // < 1 week - old
    return "text-red-400" // > 1 week - very old
  }

  const uniqueStatuses = Array.from(new Set(pods.map((p) => p.status)))

  return (
    <div className="flex gap-6 min-h-[calc(100vh-200px)]">
      {/* Main Table */}
      <div className={`transition-all duration-500 ${selectedPod ? "w-2/3" : "w-full"}`}>
        {/* Controls */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
            <Input
              placeholder="Search neural networks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900/50 border-cyan-500/30 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400/20 font-mono"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-purple-500/30 text-white rounded-md font-mono text-sm focus:border-purple-400 focus:ring-purple-400/20"
            >
              <option value="all">ALL STATUS</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-cyan-500/20 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyan-500/20 bg-gradient-to-r from-slate-800/50 to-purple-800/30">
                  {[
                    { key: "name", label: "POD NAME" },
                    { key: "namespace", label: "NAMESPACE" },
                    { key: "status", label: "STATUS" },
                    { key: "ready", label: "READY" },
                    { key: "restarts", label: "RESTARTS" },
                    { key: "age", label: "AGE" },
                    { key: "node", label: "NODE" },
                    { key: "cpu", label: "CPU" },
                    { key: "memory", label: "MEMORY" },
                  ].map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider cursor-pointer hover:text-cyan-300 transition-colors font-mono relative neural-header ${
                        sortField === column.key ? "active-sort" : ""
                      }`}
                      onClick={() => handleSort(column.key as SortField)}
                    >
                      <div className="neural-links"></div>
                      <div className="flex items-center gap-2 relative z-10">
                        {column.label}
                        {sortField === column.key && (
                          <div className="text-cyan-400">
                            {sortDirection === "asc" ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedPods.map((pod, index) => (
                  <tr
                    key={pod.name}
                    className={`border-b border-slate-700/30 hover:bg-gradient-to-r hover:from-cyan-500/5 hover:to-purple-500/5 cursor-pointer transition-all duration-300 group ${
                      selectedPod?.name === pod.name
                        ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30"
                        : ""
                    }`}
                    onClick={() => setSelectedPod(selectedPod?.name === pod.name ? null : pod)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {pod.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className="bg-purple-500/20 text-purple-300 border-purple-500/50 font-mono text-xs"
                      >
                        {pod.namespace}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(pod.status)}
                        <Badge
                          className={`${getStatusColor(pod.status)} font-mono text-xs shadow-lg ${
                            pod.status.toLowerCase() === "running"
                              ? "status-running"
                              : pod.status.toLowerCase() === "pending"
                                ? "status-pending"
                                : pod.status.toLowerCase() === "failed"
                                  ? "status-failed"
                                  : ""
                          }`}
                        >
                          {pod.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-mono text-sm font-bold ${getReadyColor(pod.ready)}`}>{pod.ready}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-mono text-sm ${pod.restarts > 0 ? "text-yellow-400" : "text-slate-300"}`}>
                        {pod.restarts}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-mono text-sm ${getAgeColor(pod.age)}`}>{pod.age}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-slate-400">{pod.node}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-cyan-400">{pod.cpu}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-purple-400">{pod.memory}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-slate-400 text-sm font-mono">
          {">"} {filteredAndSortedPods.length} of {pods.length} neural networks active
        </div>
      </div>

      {/* Side Panel */}
      {selectedPod && <PodDetailsPanel pod={selectedPod} onClose={() => setSelectedPod(null)} />}
    </div>
  )
}
