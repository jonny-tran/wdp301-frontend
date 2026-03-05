import { Metadata } from "next";
import ProductClient from "./_components/ProductClient";

export const metadata: Metadata = {
    title: "Product Catalog | Manager",
    description: "Manage VFC product inventory and categories.",
};

export default function ProductsPage({ searchParams }: { searchParams: any }) {
    return (
        <main className="p-8">
            <ProductClient searchParams={searchParams} />
        </main>
    );
}