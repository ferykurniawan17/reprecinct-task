import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/modules/shared/components/ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search attributes...",
  className = "",
  debounceMs = 300,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  // Update local state when URL search param changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearchValue(urlSearch);
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (newSearch: string) => {
      const params = new URLSearchParams(searchParams);

      if (newSearch.trim()) {
        params.set("search", newSearch.trim());
      } else {
        params.delete("search");
      }

      // Reset to first page when searching
      params.delete("page");

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (value: string) => {
      const timeoutId = setTimeout(() => {
        updateSearchParams(value);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    },
    [debounceMs, updateSearchParams]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchValue);
    return cleanup;
  }, [searchValue, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams(searchValue);
  };

  const clearSearch = () => {
    setSearchValue("");
    updateSearchParams("");
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
