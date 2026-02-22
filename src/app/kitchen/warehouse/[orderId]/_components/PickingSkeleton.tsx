export default function PickingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="h-20 animate-pulse rounded-3xl bg-white shadow-sm" />
            <div className="h-[560px] animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
    );
}
