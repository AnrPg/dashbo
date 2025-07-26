"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Server,
  Wifi,
  Clock,
  RotateCcw,
  Container,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
} from "lucide-react"

interface PodDetails {
  name: string
  namespace: string
  status: string
  ready: string
  restarts: number
  age: string
  node: string
  ip: string
  createdAt: string
  labels: Record<string, string>
  annotations: Record<string, string>
  containers: Array<{
    name: string
    image: string
    ready: boolean
    restartCount: number
    state: string
  }>
  conditions: Array<{
    type: string
    status: string
    lastTransitionTime: string
    reason?: string
    message?: string
  }>
  events: Array<{
    type: string
    reason: string
    message: string
    firstTimestamp: string
    count: number
  }>
}

interface PodDetailsProps {
  pod: PodDetails
}

export default function PodDetailsComponent({ pod }: PodDetailsProps) {
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

  const getConditionIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "true":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case "false":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
    }
  }

  const getEventTypeColor = (type: string) => {
    return type.toLowerCase() === "warning" ? "text-yellow-400" : "text-emerald-400"
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Overview Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            Pod Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Name</div>
              <div className="font-mono text-white break-all">{pod.name}</div>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Namespace</div>
              <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600">
                {pod.namespace}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Status</div>
              <Badge className={getStatusColor(pod.status)}>{pod.status}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-slate-400 text-sm">Node</div>
              <div className="font-mono text-white text-sm">{pod.node}</div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Wifi className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-slate-400 text-xs">Ready</div>
                <div className="font-mono text-white">{pod.ready}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <RotateCcw className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <div className="text-slate-400 text-xs">Restarts</div>
                <div className="font-mono text-white">{pod.restarts}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-slate-400 text-xs">Age</div>
                <div className="font-mono text-white">{pod.age}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Server className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-slate-400 text-xs">Pod IP</div>
                <div className="font-mono text-white text-sm">{pod.ip || "None"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Containers */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Container className="w-5 h-5 text-emerald-400" />
            Containers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pod.containers.map((container, index) => (
              <div
                key={container.name}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-mono text-white">{container.name}</h4>
                  <div className="flex items-center gap-2">
                    {container.ready ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm ${container.ready ? "text-emerald-400" : "text-red-400"}`}>
                      {container.ready ? "Ready" : "Not Ready"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400 mb-1">Image</div>
                    <div className="font-mono text-white break-all">{container.image}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">State</div>
                    <Badge variant="outline" className="bg-slate-600/50 text-slate-300 border-slate-500">
                      {container.state}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Restart Count</div>
                    <div className="font-mono text-white">{container.restartCount}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labels */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              Labels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(pod.labels).length > 0 ? (
                Object.entries(pod.labels).map(([key, value], index) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 rounded bg-slate-700/30 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="font-mono text-sm text-slate-300">{key}</span>
                    <span className="font-mono text-sm text-white">{value}</span>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm">No labels</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pod.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded bg-slate-700/30 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    {getConditionIcon(condition.status)}
                    <div>
                      <div className="font-mono text-sm text-white">{condition.type}</div>
                      {condition.reason && <div className="text-xs text-slate-400">{condition.reason}</div>}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      condition.status.toLowerCase() === "true"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {condition.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pod.events.length > 0 ? (
              pod.events.slice(0, 10).map((event, index) => (
                <div
                  key={index}
                  className="p-3 rounded bg-slate-700/30 border border-slate-600 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getEventTypeColor(event.type)} bg-transparent border-current`}
                      >
                        {event.type}
                      </Badge>
                      <span className="font-mono text-sm text-white">{event.reason}</span>
                    </div>
                    <div className="text-xs text-slate-400">{event.count > 1 && `${event.count}x`}</div>
                  </div>
                  <div className="text-sm text-slate-300 mb-2">{event.message}</div>
                  <div className="text-xs text-slate-400">{new Date(event.firstTimestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="text-slate-400 text-sm">No recent events</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
