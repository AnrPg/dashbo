// app/pods-list.tsx
import Link from 'next/link';
import { listPods } from '../lib/k8s';

export default async function PodsList() {
  // this runs on the server
  const pods = await listPods();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">All Kubernetes Pods</h2>
      <ul className="mt-4 space-y-2">
        {pods.map(pod => {
          const ns = pod.metadata!.namespace!;
          const name = pod.metadata!.name!;
          return (
            <li key={`${ns}/${name}`}>
              <Link href={`/pods/${ns}/${name}`}>
                <a className="text-blue-600 hover:underline">
                  {ns}/{name}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
