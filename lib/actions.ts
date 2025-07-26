"use server"

import { 
  V1Pod, 
  CoreV1Event,
  V1ContainerStatus, 
  V1PodCondition 
} from "@kubernetes/client-node";

import { k8sApi } from "./kubernetes"

export interface Pod {
  name: string
  namespace: string
  status: string
  ready: string
  restarts: number
  age: string
  node: string
  ip: string
  createdAt: string | undefined
}

export interface PodDetails extends Pod {
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

export async function getPods(): Promise<Pod[]> {
  try {
    const response = await k8sApi.listPodForAllNamespaces()

    return response.items.map((pod) => {
      const containerStatuses = pod.status?.containerStatuses || []
      const readyContainers = containerStatuses.filter((c) => c.ready).length
      const totalContainers = containerStatuses.length
      const restarts = containerStatuses.reduce((sum, c) => sum + (c.restartCount || 0), 0)

      const createdAt = pod.metadata != undefined ? pod.metadata.creationTimestamp?.toISOString() : undefined
      const age = createdAt ? getAge(new Date(createdAt)) : "Unknown"

      return {
        name: pod.metadata?.name || "Unknown",
        namespace: pod.metadata?.namespace || "default",
        status: pod.status?.phase || "Unknown",
        ready: `${readyContainers}/${totalContainers}`,
        restarts,
        age,
        node: pod.spec?.nodeName || "Unknown",
        ip: pod.status?.podIP || "None",
        createdAt: createdAt || "",
      }
    })
  } catch (error) {
    console.error("Error fetching pods:", error)
    // Return mock data for demo purposes
    return getMockPods()
  }
}

export async function getPodDetails(name: string): Promise<PodDetails> {
  const pods = (await k8sApi.listPodForAllNamespaces()).items;
  const pod = pods.find((p: V1Pod) => p.metadata?.name === name);
  if (!pod) throw new Error(`Pod ${name} not found`);

  const namespace = pod.metadata?.namespace ?? "default";

  // NOTE: use the object signature for listNamespacedEvent
  const eventList = (await k8sApi.listNamespacedEvent({ namespace })).items;
  const podEvents = eventList
    .filter((event: CoreV1Event) => event.involvedObject?.name === name)
    .map((event: CoreV1Event) => ({
      type: event.type ?? "Normal",
      reason: event.reason ?? "Unknown",
      message: event.message ?? "",
      firstTimestamp: event.firstTimestamp
        ? (event.firstTimestamp instanceof Date
            ? event.firstTimestamp.toISOString()
            : event.firstTimestamp)
        : "",
      count: event.count ?? 0,
    }));

  const containerStatuses: V1ContainerStatus[] = pod.status?.containerStatuses ?? [];
  const readyContainers = containerStatuses.filter((c) => c.ready).length;
  const totalContainers = containerStatuses.length;
  const restarts = containerStatuses.reduce(
    (sum: number, c: V1ContainerStatus) => sum + (c.restartCount ?? 0),
    0
  );
  
  const createdAt = pod.metadata != undefined ? pod.metadata.creationTimestamp?.toISOString() : ""
  const age = createdAt ? getAge(new Date(createdAt)) : "Unknown";

  const conditions = (pod.status?.conditions ?? []).map(
    (condition: V1PodCondition) => ({
      type: condition.type,
      status: condition.status,
      // always a string in the K8s API, so safe
      lastTransitionTime: condition.lastTransitionTime ?.toISOString() ?? "",
      reason: condition.reason,
      message: condition.message,
    })
  );

  const containers = (pod.spec?.containers ?? []).map((container, i) => {
    const status = containerStatuses[i];
    return {
      name: container.name,
      image: container.image ?? "Unknown",
      ready: status?.ready ?? false,
      restartCount: status?.restartCount ?? 0,
      state: status?.state ? Object.keys(status.state)[0] : "unknown",
    };
  });

  return {
    name: pod.metadata?.name ?? "Unknown",
    namespace,
    status: pod.status?.phase ?? "Unknown",
    ready: `${readyContainers}/${totalContainers}`,
    restarts,
    age,
    node: pod.spec?.nodeName ?? "Unknown",
    ip: pod.status?.podIP ?? "None",
    createdAt,
    labels: pod.metadata?.labels ?? {},
    annotations: pod.metadata?.annotations ?? {},
    containers,
    conditions,
    events: podEvents,
  };
}

function getAge(createdAt: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - createdAt.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffDays > 0) return `${diffDays}d`
  if (diffHours > 0) return `${diffHours}h`
  return `${diffMinutes}m`
}

// Mock data for demo purposes
function getMockPods(): Pod[] {
  return [
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
    },
    {
      name: "redis-master-6b8b4f4c4-9h7k2",
      namespace: "default",
      status: "Running",
      ready: "1/1",
      restarts: 1,
      age: "5h",
      node: "worker-node-2",
      ip: "10.244.2.8",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
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
    },
  ]
}

function getMockPodDetails(name: string): PodDetails {
  const basePod = getMockPods().find((p) => p.name === name) || getMockPods()[0]

  return {
    ...basePod,
    labels: {
      app: "nginx",
      version: "v1.0.0",
      environment: "production",
    },
    annotations: {
      "deployment.kubernetes.io/revision": "1",
      "kubectl.kubernetes.io/last-applied-configuration": '{"apiVersion":"apps/v1","kind":"Deployment"...}',
    },
    containers: [
      {
        name: "nginx",
        image: "nginx:1.21.0",
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
      },
      {
        type: "Ready",
        status: "True",
        lastTransitionTime: new Date(Date.now() - 30000).toISOString(),
        reason: "ContainersReady",
      },
      {
        type: "PodScheduled",
        status: "True",
        lastTransitionTime: new Date(Date.now() - 120000).toISOString(),
        reason: "PodScheduled",
      },
    ],
    events: [
      {
        type: "Normal",
        reason: "Scheduled",
        message: "Successfully assigned default/nginx-deployment-7d8b49557f-x2k9m to worker-node-1",
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
    ],
  }
}
