import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PaginationProps {
  route: string;
  totalPages: number;
}

export default function PaginationControls({
  route,
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPageSize = searchParams.get('pageSize') || '';
  const initialPage = searchParams.get('page') || '';

  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    if (page) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'page',
        value: page,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['page'],
        });

        router.push(newUrl, { scroll: false });
      }
    }
  }, [page, router, route, searchParams, pathname]);

  useEffect(() => {
    if (pageSize) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'pageSize',
        value: pageSize,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['pageSize'],
        });

        router.push(newUrl, { scroll: false });
      }
    }
  }, [pageSize, router, route, searchParams, pathname]);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(1);

    if (Number(page) > 3) {
      pages.push('ellipsis');
    }

    // Show current page and neighbors
    for (
      let i = Math.max(2, Number(page) - 1);
      i <= Math.min(totalPages - 1, Number(page) + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (Number(page) < totalPages - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => setPageSize(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select page size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex justify-center sm:justify-end">
        {/* Added wrapper */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => String(Number(prev) - 1))}
                aria-disabled={Number(page) === 1}
                className={
                  Number(page) === 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink isActive={page === pageNum}>
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((prev) => String(Number(prev) + 1))}
                aria-disabled={Number(page) === totalPages}
                className={
                  Number(page) === totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
