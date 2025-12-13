"use client";

import MultiSelect from "@/components/custom/multiSelect";
import { useLanguages } from "@/app/features/languages/_shared/_contexts/useLanguages";

export default function LanguageMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const { data: languages, isLoading, error } = useLanguages();

  if (error) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium">Languages</label>
        <div className="text-sm text-red-500">Failed to load languages</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground"> Select the languages that are supported </p>
      <MultiSelect
        label="Languages"
        items={languages ?? []}
        selected={selected}
        onChange={onChange}
      />
    </div>
  );
}