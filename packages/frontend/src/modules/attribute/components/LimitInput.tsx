import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/shared/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface LimitInputProps {
  className?: string;
}

const LIMIT_OPTIONS = [
  { value: "5", label: "5 per page" },
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];

const LimitInput: React.FC<LimitInputProps> = ({ className = "" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLimit = searchParams.get("limit") || "10";

  const updateLimitParam = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);

    if (newLimit && newLimit !== "10") {
      params.set("limit", newLimit);
    } else {
      params.delete("limit");
    }

    // Reset to first page when changing limit
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label
        htmlFor="limit-select"
        className="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        Show:
      </label>
      <Select value={currentLimit} onValueChange={updateLimitParam}>
        <SelectTrigger id="limit-select" className="w-32">
          <SelectValue placeholder="Select limit" />
        </SelectTrigger>
        <SelectContent>
          {LIMIT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LimitInput;
