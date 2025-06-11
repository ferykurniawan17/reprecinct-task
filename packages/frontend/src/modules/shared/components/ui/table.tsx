import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  asChild?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "table";
    return (
      <div className="relative w-full overflow-auto rounded-md border border-gray-200 shadow-sm">
        <Comp
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm border-collapse",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
Table.displayName = "Table";

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  asChild?: boolean;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "thead";
    return (
      <Comp
        ref={ref}
        className={cn(
          "[&_tr]:border-b [&_tr]:border-gray-200 bg-gray-50/50",
          className
        )}
        {...props}
      />
    );
  }
);
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  asChild?: boolean;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "tbody";
    return (
      <Comp
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
      />
    );
  }
);
TableBody.displayName = "TableBody";

interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  asChild?: boolean;
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "tfoot";
    return (
      <Comp
        ref={ref}
        className={cn(
          "border-t border-gray-200 bg-gray-50/50 font-medium [&>tr]:last:border-b-0",
          className
        )}
        {...props}
      />
    );
  }
);
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  asChild?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "tr";
    return (
      <Comp
        ref={ref}
        className={cn(
          "border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  asChild?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "th";
    return (
      <Comp
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-semibold text-gray-900 [&:has([role=checkbox])]:pr-0 first:pl-6 last:pr-6",
          className
        )}
        {...props}
      />
    );
  }
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  asChild?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "td";
    return (
      <Comp
        ref={ref}
        className={cn(
          "p-4 align-middle text-gray-700 [&:has([role=checkbox])]:pr-0 first:pl-6 last:pr-6",
          className
        )}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  asChild?: boolean;
}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "caption";
  return (
    <Comp
      ref={ref}
      className={cn("mt-4 text-sm text-gray-600", className)}
      {...props}
    />
  );
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
