import { Suspense } from "react"
import PodDetails from "@/components/pod-details"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ name: string }>
}

// Mock detailed pod data
const getMockPodDetails = (name: string) => ({
  name: decodeURIComponent(name),
  namespace: "default",
  status: "Running",
  ready: "1/1",
  restarts: 0,
  age: "2d",
  node: "worker-node-1",
  ip: "10.244.1.15",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  labels: {
    app: "nginx",
    version: "v1.0.0",
    environment: "production",
    "app.kubernetes.io/name": "nginx",
    "app.kubernetes.io/instance": "nginx-prod",
  },
  annotations: {
    "deployment.kubernetes.io/revision": "1",
    "kubectl.kubernetes.io/last-applied-configuration": '{"apiVersion":"apps/v1","kind":"Deployment"...}',
    "prometheus.io/scrape": "true",
    "prometheus.io/port": "9090",
  },
  containers: [
    {
      name: "nginx",
      image: "nginx:1.21.0",
      ready: true,
      restartCount: 0,
      state: "running",
    },
    {
      name: "sidecar-proxy",
      image: "envoyproxy/envoy:v1.18.0",
      ready: true,
      restartCount: 0,
      state: "running",
    },
  ],
  conditions: [
    {
      type: "Initialized",
      status: "True",
      lastTransitionTime: new Date(Date.now() - 60000).toISOString(),
      reason: "PodCompleted",
      message: "All init containers have completed successfully",
    },
    {
      type: "Ready",
      status: "True",
      lastTransitionTime: new Date(Date.now() - 30000).toISOString(),
      reason: "ContainersReady",
      message: "All containers are ready",
    },
    {
      type: "ContainersReady",
      status: "True",
      lastTransitionTime: new Date(Date.now() - 30000).toISOString(),
      reason: "ContainersReady",
      message: "All containers are ready",
    },
    {
      type: "PodScheduled",
      status: "True",
      lastTransitionTime: new Date(Date.now() - 120000).toISOString(),
      reason: "PodScheduled",
      message: "Pod has been scheduled to node worker-node-1",
    },
  ],
  events: [
    {
      type: "Normal",
      reason: "Scheduled",
      message: `Successfully assigned default/${decodeURIComponent(name)} to worker-node-1`,
      firstTimestamp: new Date(Date.now() - 120000).toISOString(),
      count: 1,
    },
    {
      type: "Normal",
      reason: "Pulled",
      message: 'Container image "nginx:1.21.0" already present on machine',
      firstTimestamp: new Date(Date.now() - 90000).toISOString(),
      count: 1,
    },
    {
      type: "Normal",
      reason: "Created",
      message: "Created container nginx",
      firstTimestamp: new Date(Date.now() - 60000).toISOString(),
      count: 1,
    },
    {
      type: "Normal",
      reason: "Started",
      message: "Started container nginx",
      firstTimestamp: new Date(Date.now() - 30000).toISOString(),
      count: 1,
    },
    {
      type: "Warning",
      reason: "FailedMount",
      message: "Unable to attach or mount volumes: unmounted volumes=[config-volume]",
      firstTimestamp: new Date(Date.now() - 150000).toISOString(),
      count: 3,
    },
  ],
})

export default async function PodDetailsPage({ params }: PageProps) {
  const { name } = await params

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Pods
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-white">Pod Details</h1>
          <p className="text-slate-400">Detailed information for pod: {decodeURIComponent(name)}</p>
        </div>

        <Suspense fallback={<LoadingDetails />}>
          <PodDetails pod={getMockPodDetails(name)} />
        </Suspense>
      </div>
    </div>
  )
}

function LoadingDetails() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-emerald-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-lg">Loading pod details...</span>
      </div>
    </div>
  )
}
