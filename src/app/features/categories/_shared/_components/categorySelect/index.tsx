"use client";

import MultiSelect from "@/components/custom/multiSelect";
import { useCategories } from "@/app/features/categories/_shared/_contexts/useCategories";

export default function CategoryMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const { data: categories, isLoading, error } = useCategories();

  if (error) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium">Categories</label>
        <div className="text-sm text-red-500">Failed to load categories</div>
      </div>
    );
  }

  return (
    <MultiSelect
      label="Categories"
      items={categories ?? []}
      selected={selected}
      onChange={onChange}
    />
  );
}