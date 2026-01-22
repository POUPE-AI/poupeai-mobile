import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { Text } from "@/components/atoms/Text";
import { CategoryListItem } from "@/components/atoms/CategoryListItem";
import { CategoryFilterTag } from "@/components/atoms/CategoryFilterTag";
import { CategoryModal } from "@/components/molecules/CategoryModal";
import { ConfirmDeleteModal } from "@/components/molecules/ConfirmDeleteModal";
import { Category, CategoryType } from "@/types";
import { styles } from "./styles";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { CreateCategoryRequest } from "@/services/categories";
import { colors } from "@/constants/theme";

export const CategoriesList = () => {
  const { theme, colors: themeColors } = useTheme();
  const style = styles(theme);

  const [activeFilters, setActiveFilters] = useState<CategoryType[]>([
    "INCOME",
    "EXPENSE",
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const {
    data: categoriesList,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchCategories,
  } = useCategories();

  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const filteredCategories = useMemo(() => {
    const categories =
      categoriesList?.pages.flatMap((page) => page.content) || [];

    return categories.filter(
      (category) => category && activeFilters.includes(category.type),
    );
  }, [activeFilters, categoriesList, isLoading]);

  const toggleFilter = (type: CategoryType) => {
    setActiveFilters((prev) => {
      if (prev.includes(type)) {
        return prev.length > 1 ? prev.filter((t) => t !== type) : prev;
      } else {
        return [...prev, type];
      }
    });
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setModalVisible(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      setDeleteModalVisible(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode("create");
    setModalVisible(true);
  };

  const handleSaveCategory = async (data: CreateCategoryRequest) => {
    try {
      if (modalMode === "create") {
        await createCategoryMutation.mutateAsync(data);
      } else if (selectedCategory) {
        await updateCategoryMutation.mutateAsync({
          id: selectedCategory.id,
          ...data,
        });
      }

      setModalVisible(false);
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <View style={style.emptyContainer}>
        <Text style={style.emptyTitle}>Carregando categorias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={style.emptyContainer}>
        <Text style={style.emptyTitle}>Erro ao carregar categorias</Text>
      </View>
    );
  }

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <CategoryListItem
      category={item}
      onEdit={handleEditCategory}
      onDelete={handleDeleteCategory}
    />
  );

  const renderEmptyState = () => (
    <View style={style.emptyContainer}>
      <Ionicons
        name="folder-open-outline"
        size={64}
        color={themeColors.textSecondary}
      />
      <Text style={style.emptyTitle}>Nenhuma categoria encontrada</Text>
      <Text style={style.emptySubtitle}>
        {activeFilters.length === 1
          ? `Não há categorias de ${
              activeFilters[0] === "INCOME" ? "receita" : "despesa"
            } cadastradas`
          : "Ajuste os filtros ou crie uma nova categoria"}
      </Text>
    </View>
  );

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.headerTitle}>Categorias</Text>
        <TouchableOpacity style={style.addButton} onPress={handleAddCategory}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={style.filtersContainer}>
        <View style={style.filtersRow}>
          <CategoryFilterTag
            type="INCOME"
            isActive={activeFilters.includes("INCOME")}
            onPress={toggleFilter}
          />
          <CategoryFilterTag
            type="EXPENSE"
            isActive={activeFilters.includes("EXPENSE")}
            onPress={toggleFilter}
          />
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderCategoryItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.listContent}
        ListEmptyComponent={renderEmptyState}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" color={colors.primary[500]} />
          ) : null
        }
        refreshing={isLoading}
        onRefresh={refetchCategories}
      />

      <CategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
        mode={modalMode}
      />

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Categoria"
        message="Tem certeza que deseja excluir esta categoria?"
        itemName={categoryToDelete?.name}
      />
    </View>
  );
};
