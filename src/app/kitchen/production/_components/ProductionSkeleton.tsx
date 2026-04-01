export default function ProductionSkeleton() {
    return (
        <div className="space-y-8">
            <div className="h-28 animate-pulse rounded-lg border-2 border-zinc-200 bg-zinc-100" />
            <div className="grid gap-4 md:grid-cols-3">
                <div className="h-32 animate-pulse rounded-lg border-2 border-zinc-200 bg-zinc-100" />
                <div className="h-32 animate-pulse rounded-lg border-2 border-zinc-200 bg-zinc-100" />
                <div className="h-32 animate-pulse rounded-lg border-2 border-zinc-200 bg-zinc-100" />
            </div>
            <div className="h-[420px] animate-pulse rounded-lg border-2 border-zinc-200 bg-zinc-100" />
        </div>
    );
}
