"use server"

import { 
  V1Pod, 
  CoreV1Event,
  V1ContainerStatus, 
  V1PodCondition 
} from "@kubernetes/client-node";

import { k8sApi, kc } from "./kubernetes"
import { CustomObjectsApi } from "@kubernetes/client-node";

export interface Pod {
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
    const customApi = kc.makeApiClient(CustomObjectsApi);
    const [podListResp, metricsResp] = await Promise.all([
      k8sApi.listPodForAllNamespaces(),
      customApi.listClusterCustomObject({
        group:   "metrics.k8s.io",
        version: "v1beta1",
        plural:  "pods",
      })
    ]);

    interface PodMetric {
      metadata: { namespace: string; name: string };
      containers: Array<{ usage: { cpu: string; memory: string } }>;
    }
    const metricsBody = metricsResp.body as { items: PodMetric[] };
    const metricsItems = metricsBody.items || [];
    const metricsMap = new Map<string, { cpu: string; memory: string }>();
    for (const m of metricsItems) {
      const ns = m.metadata.namespace;
      const name = m.metadata.name;
      // each m.containers[i].usage.cpu, usage.memory
      let totalCpu = 0, totalMemBytes = 0;
      for (const c of m.containers) {
        // CPU is in millicores (e.g. "50m")
        const cpuStr: string = c.usage.cpu;
        totalCpu += cpuStr.endsWith("m")
          ? parseInt(cpuStr.slice(0, -1))
          : parseFloat(cpuStr) * 1000;
        // Memory is in Ki, Mi, etc.
        const memStr: string = c.usage.memory;
        const val = parseFloat(memStr);
        if (memStr.endsWith("Ki")) totalMemBytes += val * 1024;
        else if (memStr.endsWith("Mi")) totalMemBytes += val * 1024 * 1024;
        else if (memStr.endsWith("Gi")) totalMemBytes += val * 1024 * 1024 * 1024;
        else totalMemBytes += val;
      }
      metricsMap.set(
        `${ns}/${name}`,
        {
          cpu: `${Math.round(totalCpu)}m`,
          memory: `${Math.round(totalMemBytes / 1024 / 1024)}Mi`
        }
      );
    }

    return (podListResp.items as V1Pod[]).map((pod) => {
      const containerStatuses = pod.status?.containerStatuses || []
      const readyContainers = containerStatuses.filter((c) => c.ready).length
      const totalContainers = containerStatuses.length
      const restarts = containerStatuses.reduce((sum, c) => sum + (c.restartCount || 0), 0)

      const createdAt = pod.metadata != undefined ? pod.metadata.creationTimestamp?.toISOString() : undefined
      const age = createdAt ? getAge(new Date(createdAt)) : "Unknown"

      // lookup metrics, default to "0m"/"0Mi"
      const key = `${pod.metadata?.namespace || "default"}/${pod.metadata?.name}`;
      const met = metricsMap.get(key) || { cpu: "0m", memory: "0Mi" };

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
        cpu: met.cpu,
        memory: met.memory,
      }
    })
  } catch (error) {
    console.error("Error fetching pods:", error)
    // Return mock data for demo purposes
    return []
  }
}

export async function getPodDetails(name: string): Promise<PodDetails> {
  const pods = (await k8sApi.listPodForAllNamespaces()).items;
  const pod = pods.find((p: V1Pod) => p.metadata?.name === name);
  if (!pod) throw new Error(`Pod ${name} not found`);

  const namespace = pod.metadata?.namespace ?? "default";

  const customApi = kc.makeApiClient(CustomObjectsApi);
  const metricsResp = await customApi.listNamespacedCustomObject({
    group:     "metrics.k8s.io",
    version:   "v1beta1",
    namespace,               // target the same namespace
    plural:    "pods",
  });

  interface PodMetric {
    metadata: { namespace: string; name: string };
    containers: Array<{ usage: { cpu: string; memory: string } }>;
  }
  const body = metricsResp.body as { items: PodMetric[] };
  const podMetric = body.items.find((m) => m.metadata.name === name);
  let cpu = "0m", memory = "0Mi";
  if (podMetric) {
    let totalCpu = 0, totalMemBytes = 0;
    for (const c of podMetric.containers) {
      const cpuStr = c.usage.cpu;
      totalCpu += cpuStr.endsWith("m")
        ? parseInt(cpuStr.slice(0, -1), 10)
        : parseFloat(cpuStr) * 1000;
      const memStr = c.usage.memory;
      const val = parseFloat(memStr);
      if (memStr.endsWith("Ki")) totalMemBytes += val * 1024;
      else if (memStr.endsWith("Mi")) totalMemBytes += val * 1024 ** 2;
      else if (memStr.endsWith("Gi")) totalMemBytes += val * 1024 ** 3;
      else totalMemBytes += val;
    }
    cpu = `${Math.round(totalCpu)}m`;
    memory = `${Math.round(totalMemBytes / 1024 ** 2)}Mi`;
  }
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
  
  const createdAt = pod.metadata != undefined ? pod.metadata.creationTimestamp?.toISOString() : undefined
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
    createdAt: createdAt || "",
    labels: pod.metadata?.labels ?? {},
    annotations: pod.metadata?.annotations ?? {},
    containers,
    conditions,
    events: podEvents,
    cpu,
    memory,
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
