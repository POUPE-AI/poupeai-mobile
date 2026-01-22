import { api } from "./api";
import { Category, CategoryType } from "../types/categories";

export interface CategoriesResponse {
  content: Category[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateCategoryRequest {
  name: string;
  colorHex: string;
  iconName: string;
  type: "INCOME" | "EXPENSE";
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
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

  async getCategoryById(id: string): Promise<Category> {
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
      `${this.baseUrl}${id}`,
      updateData,
    );
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}${id}`);
  }

  async getCategoriesByType(type: CategoryType): Promise<Category[]> {
    const response = await this.getCategories({ type });
    return response.content;
  }
}

export const categoriesService = new CategoriesService();
