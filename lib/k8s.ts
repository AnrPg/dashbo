// lib/k8s.ts
import { KubeConfig, CoreV1Api, V1Pod } from '@kubernetes/client-node';

const kc = new KubeConfig();
kc.loadFromDefault(); // ~/.kube/config or in-cluster
const api = kc.makeApiClient(CoreV1Api);

// List all pods across namespaces
export async function listPods(): Promise<V1Pod[]> {
  const podsList = await api.listPodForAllNamespaces();
  return podsList.items; // remove .body for V1PodList
}

// Get a single pod by namespace and name
export async function getPod(namespace: string, name: string): Promise<V1Pod> {
  // use object parameter for the updated method signature
  const pod = await api.readNamespacedPod({ namespace, name });
  return pod; // direct V1Pod result
}