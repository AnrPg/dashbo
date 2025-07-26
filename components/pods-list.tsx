"use client"

import { useState } from "react"
import PodCard from "./pod-card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { listPods } from '../lib/k8s';

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

interface PodsListProps {
  pods: Pod[]
}

export default function PodsList({ pods }: PodsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [namespaceFilter, setNamespaceFilter] = useState<string>("all")

  const filteredPods = pods.filter((pod) => {
    const matchesSearch =
      pod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pod.namespace.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || pod.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesNamespace = namespaceFilter === "all" || pod.namespace === namespaceFilter

    return matchesSearch && matchesStatus && matchesNamespace
  })

  const uniqueStatuses = Array.from(new Set(pods.map((p) => p.status)))
  const uniqueNamespaces = Array.from(new Set(pods.map((p) => p.namespace)))

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search pods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                Status: {statusFilter === "all" ? "All" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-white hover:bg-slate-700">
                All Statuses
              </DropdownMenuItem>
              {uniqueStatuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className="text-white hover:bg-slate-700"
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700">
                <Filter className="w-4 h-4 mr-2" />
                NS: {namespaceFilter === "all" ? "All" : namespaceFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={() => setNamespaceFilter("all")} className="text-white hover:bg-slate-700">
                All Namespaces
              </DropdownMenuItem>
              {uniqueNamespaces.map((namespace) => (
                <DropdownMenuItem
                  key={namespace}
                  onClick={() => setNamespaceFilter(namespace)}
                  className="text-white hover:bg-slate-700"
                >
                  {namespace}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-slate-400 text-sm">
        Showing {filteredPods.length} of {pods.length} pods
      </div>

      {/* Pods Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPods.map((pod, index) => (
          <PodCard key={pod.name} pod={pod} index={index} />
        ))}
      </div>

      {filteredPods.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No pods found</div>
          <div className="text-slate-500">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}
