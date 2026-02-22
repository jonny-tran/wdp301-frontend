import { Suspense } from "react";
import type { RawSearchParams } from "@/app/supply/_components/query";
import IssuesClient from "./_components/IssuesClient";
import IssuesSkeleton from "./_components/IssuesSkeleton";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function SupplyIssuesPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense fallback={<IssuesSkeleton />}>
            <IssuesClient searchParams={searchParams} />
        </Suspense>
    );
}
