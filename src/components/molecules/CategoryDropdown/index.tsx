import React, { useEffect } from "react";
import { ActivityIndicator, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DropdownSelector } from "@/components/atoms/DropdownSelector";
import { FormField } from "@/components/atoms/FormField";
import { Text } from "@/components/atoms/Text";
import { Category } from "@/types";
import { colors } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";
import { styles } from "./styles";
import { useCategories } from "@/hooks/useCategories";

interface CategoryDropdownProps {
  selectedCategoryId?: string;
  onSelect: (categoryId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  filterType?: "INCOME" | "EXPENSE";
  onCreateCategory?: () => void;
  error?: string;
  label?: string;
  type?: "INCOME" | "EXPENSE";
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategoryId,
  onSelect,
  isOpen,
  onToggle,
  filterType,
  onCreateCategory,
  error: externalError,
  label = "Categoria",
  type,
}) => {
  const { theme } = useTheme();
  const style = styles(theme);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCategories();

  useEffect(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const effectiveFilterType = type || filterType;

  const filteredCategories = effectiveFilterType
    ? categories?.pages
        .flatMap((page) => page.content)
        .filter((category: Category) => category.type === effectiveFilterType)
    : categories?.pages.flatMap((page) => page.content);

  const dropdownItems =
    filteredCategories?.map((category) => ({
      id: category.id,
      label: category.name,
      color: category.colorHex,
    })) || [];

  const handleSelect = (item: { id: string | number }) => {
    onSelect(String(item.id));
    onToggle(); // Fechar dropdown após seleção
  };

  if (isCategoriesLoading) {
    return (
      <FormField label={label} error={externalError}>
        <View style={style.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={style.loadingText}>Carregando categorias...</Text>
        </View>
      </FormField>
    );
  }

  return (
    <FormField label={label} error={externalError || error?.message}>
      <View style={style.container}>
        <View style={style.dropdownContainer}>
          <DropdownSelector
            items={dropdownItems}
            selectedId={selectedCategoryId}
            onSelect={handleSelect}
            placeholder="Selecione uma categoria"
            isOpen={isOpen}
            onToggle={onToggle}
            error={!!error}
            showColorDot={true}
          />
        </View>

        {onCreateCategory && (
          <TouchableOpacity
            style={style.createButton}
            onPress={onCreateCategory}
          >
            <Ionicons name="add" size={20} color={colors.theme[theme].text} />
          </TouchableOpacity>
        )}
      </View>
    </FormField>
  );
};
