import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-10 w-10 p-0 rounded-xl"
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <span className="text-sm font-medium text-slate-600">
                Сторінка {currentPage} з {totalPages}
            </span>

            <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-10 w-10 p-0 rounded-xl"
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
}
