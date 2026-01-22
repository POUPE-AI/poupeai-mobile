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
  selectedCategoryId?: number;
  onSelect: (categoryId: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  filterType?: "income" | "expense";
  onCreateCategory?: () => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategoryId,
  onSelect,
  isOpen,
  onToggle,
  filterType,
  onCreateCategory,
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

  const filteredCategories = filterType
    ? categories?.pages
        .flatMap((page) => page.results)
        .filter((category: Category) => category.type === filterType)
    : categories?.pages.flatMap((page) => page.results);

  const dropdownItems =
    filteredCategories?.map((category) => ({
      id: category.id,
      label: category.name,
      color: category.color_hex,
    })) || [];

  const handleSelect = (item: { id: string | number }) => {
    onSelect(item.id as number);
    onToggle(); // Fechar dropdown após seleção
  };

  if (isCategoriesLoading) {
    return (
      <FormField label="Categoria" error={error || undefined}>
        <View style={style.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[500]} />
          <Text style={style.loadingText}>Carregando categorias...</Text>
        </View>
      </FormField>
    );
  }

  return (
    <FormField label="Categoria" error={error?.message || undefined}>
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
