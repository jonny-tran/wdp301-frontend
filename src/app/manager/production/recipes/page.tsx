import { Suspense } from "react";
import type { RawSearchParams } from "@/app/manager/_components/query";
import RecipesClient from "./_components/RecipesClient";

type Props = {
    searchParams: Promise<RawSearchParams>;
};

export default async function ManagerProductionRecipesPage(props: Props) {
    const searchParams = await props.searchParams;

    return (
        <Suspense
            fallback={
                <div className="p-12 text-center text-xs font-semibold text-slate-400">Đang tải công thức...</div>
            }
        >
            <RecipesClient searchParams={searchParams} />
        </Suspense>
    );
}
