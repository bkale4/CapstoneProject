import { useState } from "react";

// Manages expandable status groups across administrative screens
export const useStatusGroups = (initialExpanded: string[] = []) => {
  const [expandedGroups, setExpandedGroups] =
    useState<string[]>(initialExpanded);

  // Expands or collapses a selected status group
  const toggleGroup = (status: string) => {
    setExpandedGroups((prev) =>
      prev.includes(status)
        ? prev.filter((group) => group !== status)
        : [...prev, status],
    );
  };

  return {
    expandedGroups,
    toggleGroup,
  };
};
