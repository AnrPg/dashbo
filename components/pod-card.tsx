"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Server, Wifi, RotateCcw } from "lucide-react"
import Link from "next/link"

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
}

interface PodCardProps {
  pod: Pod
  index: number
}

export default function PodCard({ pod, index }: PodCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "running":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "succeeded":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
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

  return (
    <Link href={`/pods/${encodeURIComponent(pod.name)}`}>
      <Card
        className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer group animate-fade-in-up"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-mono text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                  {pod.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
                    {pod.namespace}
                  </Badge>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(pod.status)}`}>{pod.status}</Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-slate-700/50">
                  <Wifi className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Ready</div>
                  <div className={`font-mono ${getReadyColor(pod.ready)}`}>{pod.ready}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-slate-700/50">
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Restarts</div>
                  <div className={`font-mono ${pod.restarts > 0 ? "text-yellow-400" : "text-slate-300"}`}>
                    {pod.restarts}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-slate-700/50">
                  <Clock className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Age</div>
                  <div className="font-mono text-slate-300">{pod.age}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-slate-700/50">
                  <Server className="w-3 h-3 text-slate-400" />
                </div>
                <div>
                  <div className="text-slate-400 text-xs">Node</div>
                  <div className="font-mono text-slate-300 text-xs truncate">{pod.node}</div>
                </div>
              </div>
            </div>

            {/* IP Address */}
            {pod.ip && (
              <div className="pt-2 border-t border-slate-700">
                <div className="text-slate-400 text-xs mb-1">Pod IP</div>
                <div className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  {pod.ip}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
