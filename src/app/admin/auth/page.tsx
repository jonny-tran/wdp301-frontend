import { RawSearchParams } from "@/app/kitchen/_components/query";
import UserClient from "./_components/UserClient";

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-white">
      <UserClient searchParams={resolvedSearchParams} />
    </div>
  );
}
