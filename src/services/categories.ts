import { api } from "./api";
import { Category, CategoryType } from "../types/categories";

export interface CategoriesResponse {
  results: Category[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  color_hex: string;
  type: CategoryType;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

export class CategoriesService {
  private baseUrl = "core/api/v1/categories/";

  async getCategories(params?: {
    type?: CategoryType;
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<CategoriesResponse> {
    const response = await api.get(this.baseUrl, { ...params });
    return response.data;
  }

  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get<Category>(`${this.baseUrl}${id}/`);
    return response.data;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<Category>(this.baseUrl, data);
    return response.data;
  }

  async updateCategory(data: UpdateCategoryRequest): Promise<Category> {
    const { id, ...updateData } = data;
    const response = await api.patch<Category>(
      `${this.baseUrl}${id}/`,
      updateData,
    );
    return response.data;
  }

  // Deletar categoria
  async deleteCategory(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}${id}/`);
  }

  // Buscar categorias por tipo
  async getCategoriesByType(type: CategoryType): Promise<Category[]> {
    const response = await this.getCategories({ type });
    return response.results;
  }
}

// Exportar instância única do serviço
export const categoriesService = new CategoriesService();
