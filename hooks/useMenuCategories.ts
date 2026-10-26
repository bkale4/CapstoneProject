import { useState } from "react";

// Manages expandable parent categories and subcategories for a menu
export const useMenuCategories = () => {
  // Tracks expanded individual categories
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // Tracks expanded parent categories
  const [expandedParentCategories, setExpandedParentCategories] = useState<
    string[]
  >([]);

  // Expands or collapses an individual category
  const toggleCategory = (categoryIndex: number) => {
    setExpandedCategories((previous) =>
      previous.includes(categoryIndex)
        ? previous.filter((index) => index !== categoryIndex)
        : [...previous, categoryIndex],
    );
  };

  // Expands or collapses a parent category
  const toggleParentCategory = (parentCategory: string) => {
    setExpandedParentCategories((previous) =>
      previous.includes(parentCategory)
        ? previous.filter((name) => name !== parentCategory)
        : [...previous, parentCategory],
    );
  };

  return {
    expandedCategories,
    setExpandedCategories,
    expandedParentCategories,
    setExpandedParentCategories,
    toggleCategory,
    toggleParentCategory,
  };
};
