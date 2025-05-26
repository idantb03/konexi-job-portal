import { Button } from '@/components/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, totalCount, pageSize, onPageChange }: PaginationProps) {
  const maxButtonsToShow = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);
  
  if (endPage - startPage + 1 < maxButtonsToShow && startPage > 1) {
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
          <span className="font-medium">{totalCount}</span> results
        </div>
        <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="secondary"
            className="!rounded-r-none"
          >
            Previous
          </Button>
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <Button
              key={page}
              onClick={() => onPageChange(page)}
              variant={page === currentPage ? "primary" : "secondary"}
              className={page === currentPage ? "!rounded-none" : "!rounded-none"}
            >
              {page}
            </Button>
          ))}
          
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="secondary"
            className="!rounded-l-none"
          >
            Next
          </Button>
        </nav>
      </div>
    </div>
  );
}
