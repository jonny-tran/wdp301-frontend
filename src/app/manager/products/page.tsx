// src/app/manager/products/page.tsx
import ProductClient from "./_components/ProductClient";

export default function ProductsPage({ searchParams }: { searchParams: any }) {
    return (
        <main className="p-8">
            <ProductClient searchParams={searchParams} />
        </main>
    );
}