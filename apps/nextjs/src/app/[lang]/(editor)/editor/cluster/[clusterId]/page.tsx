import { notFound, redirect } from "next/navigation";
import type { User } from "@saasfly/auth";

import { authOptions, getCurrentUser } from "@saasfly/auth";

import { ClusterConfig } from "~/components/k8s/cluster-config";
import type { Cluster } from "~/types/k8s";

// Force dynamic rendering for this page as it requires database access at runtime
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getClusterForUser(clusterId: Cluster["id"], userId: User["id"]) {
  // Import db dynamically to prevent build-time execution
  const { db } = await import("@saasfly/db");

  return await db
    .selectFrom("K8sClusterConfig")
    .selectAll()
    .where("id", "=", Number(clusterId))
    .where("authUserId", "=", userId)
    .executeTakeFirst();
}

interface EditorClusterProps {
  params: {
    clusterId: number;
    lang: string;
  };
}

export default async function EditorClusterPage({
  params,
}: EditorClusterProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login-clerk");
  }

  // console.log("EditorClusterPage user:" + user.id + "params:", params);
  const cluster = await getClusterForUser(params.clusterId, user.id);

  if (!cluster) {
    notFound();
  }
  return (
    <ClusterConfig
      cluster={{
        id: cluster.id,
        name: cluster.name,
        location: cluster.location,
      }}
      params={{ lang: params.lang }}
    />
  );
}
