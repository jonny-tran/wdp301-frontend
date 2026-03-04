'use client';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from "@/lib/utils";

interface BasePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
}

export function BasePagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
}: BasePaginationProps) {
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-white/50 backdrop-blur-sm rounded-b-[2rem]">
            {/* Info text - Left side */}
            {totalItems !== undefined && itemsPerPage !== undefined && (
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    Showing <span className="text-slate-900">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> - <span className="text-slate-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-slate-900">{totalItems}</span>
                </p>
            )}

            {/* Pagination - Right side */}
            <Pagination className="mx-0 w-auto">
                <PaginationContent className="gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            className={cn(
                                "rounded-xl border transition-all px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20",
                                currentPage === 1
                                    ? "pointer-events-none border-gray-100 text-gray-300 opacity-50"
                                    : "cursor-pointer border-gray-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary hover:shadow-sm"
                            )}
                        />
                    </PaginationItem>

                    {generatePageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                            {page === '...' ? (
                                <PaginationEllipsis className="text-slate-400" />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page as number)}
                                    isActive={currentPage === page}
                                    className={cn(
                                        "h-9 w-9 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center",
                                        currentPage === page
                                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/30"
                                            : "cursor-pointer border-gray-100 bg-white text-slate-500 hover:border-primary/40 hover:text-primary"
                                    )}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={cn(
                                "rounded-xl border transition-all px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20",
                                currentPage === totalPages
                                    ? "pointer-events-none border-gray-100 text-gray-300 opacity-50"
                                    : "cursor-pointer border-gray-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary hover:shadow-sm"
                            )}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}