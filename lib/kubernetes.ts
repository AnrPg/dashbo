// lib/k8s.ts
import { KubeConfig, CoreV1Api, V1Pod } from '@kubernetes/client-node';
import * as fs from 'fs';

const kc = new KubeConfig();

const host = "***";
const port = "***";
const sa = "***";
const token = "***";

if (!host || !port) {
  throw new Error('\tNeeded in-cluster env vars are missing');
}

const cluster = {
  name: 'inCluster',
  server: `https://${host}:${port}`
};


const user = {
  name: 'inClusterUser',
  // authProvider: {
  //   name: 'tokenFile',
  //   config: { tokenFile: '/var/run/secrets/kubernetes.io/serviceaccount/token' }
  // }
  user: { token }
};
const context = {
  name: 'inClusterContext',
  user: user.name,
  cluster: cluster.name,
  namespace: process.env.KUBERNETES_NAMESPACE || 'default'
};
kc.loadFromOptions({
  clusters: [{ name: 'inCluster', server: `https://${host}:${port}`, skipTLSVerify: true}],
  users: [{ name: 'inClusterUser', user: { token } }],
  contexts: [{
    name: 'inClusterContext',
    cluster: 'inCluster',
    user: 'inClusterUser',
    namespace: "tenant-a9"
  }],
  currentContext: 'inClusterContext'
});


// // If we’re running inside a pod, use in-cluster config; otherwise fallback to default kubeconfig.
// try {
//   kc.loadFromCluster();
// } catch {
//   kc.loadFromDefault();
// }

const k8sApi = kc.makeApiClient(CoreV1Api);

// List all pods across namespaces
export async function listPods(): Promise<V1Pod[]> {
  const podsList = await k8sApi.listPodForAllNamespaces();
  return podsList.items; // remove .body for V1PodList
}

// Get a single pod by namespace and name
export async function getPod(namespace: string, name: string): Promise<V1Pod> {
  // use object parameter for the updated method signature
  const pod = await k8sApi.readNamespacedPod({ namespace, name });
  return pod; // direct V1Pod result
}
  // console.log('@@@ K8S HOST:', process.env.KUBERNETES_SERVICE_HOST);
  // console.log('@@@ K8S PORT:', process.env.KUBERNETES_SERVICE_PORT);
  console.log('@@@ Loaded server:', kc.getCurrentCluster()?.server);
  console.log('@@@ Loaded user:', kc.getCurrentUser()?.name);
  console.log('@@@ Loaded context:', kc.getCurrentContext());
  console.log('\n@@@ Loaded kubeconfig:', kc.exportConfig().toString(), "\n");

export {
  k8sApi,
  kc
}
