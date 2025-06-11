"use client";

import useAttributesPage from "@/modules/attribute/hooks/useAttributesPage";
import { useSearchParams } from "next/navigation";
import React from "react";
import AttributesTable from "@/modules/attribute/components/AttributesTable";
import AttributesForm from "@/modules/attribute/components/AttributesForm";
import SearchInput from "@/modules/attribute/components/SearchInput";
import LimitInput from "@/modules/attribute/components/LimitInput";

const AttributesPage: React.FC = () => {
  const searchParams = useSearchParams();

  const { data, isFetching } = useAttributesPage({
    tableQueries: {
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
      search: searchParams.get("search") || "",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <AttributesForm />

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <SearchInput
                placeholder="Search attributes by name..."
                className="flex-1 max-w-md"
              />
              <LimitInput className="flex-shrink-0" />
            </div>
          </div>

          <AttributesTable
            attributes={data?.data || []}
            isLoading={isFetching}
            searchQuery={searchParams.get("search") || ""}
          />

          {data?.total !== undefined && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {searchParams.get("search")
                  ? `Found ${data.total} attribute${
                      data.total !== 1 ? "s" : ""
                    } matching "${searchParams.get("search")}"`
                  : `Total: ${data.total} attributes`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttributesPage;
