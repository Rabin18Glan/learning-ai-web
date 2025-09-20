import { ChevronLeft, ChevronRight } from "lucide-react";

// Interfaces
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = "" }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full border-collapse bg-card text-card-foreground">
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-muted/50">
    {children}
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody>
    {children}
  </tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children, className = "" }) => (
  <tr className={`border-b border-border hover:bg-muted/50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const TableHead: React.FC<TableHeadProps> = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left font-medium text-muted-foreground ${className}`}>
    {children}
  </th>
);

export const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => (
  <td className={`px-4 py-3 ${className}`}>
    {children}
  </td>
);



interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-card border-t border-border">
      <div className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-0">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md ${
              currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground bg-background border border-border hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};