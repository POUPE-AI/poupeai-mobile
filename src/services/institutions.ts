import { Institution } from "@/types/institutions";
import { api } from "./api";

export class InstitutionsService {
  private baseUrl = "core/api/v1/institutions";

  async getInstitutions(): Promise<Institution[]> {
    const response = await api.get(this.baseUrl);
    return response.data;
  }
}

export const institutionsService = new InstitutionsService();
