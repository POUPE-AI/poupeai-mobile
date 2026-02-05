import { api } from "./api";
import { Profile } from "@/types/profile";

export class ProfileService {
  private baseUrl = "core/api/v1/profiles/me";

  async getProfile(): Promise<Profile> {
    const response = await api.get<Profile>(this.baseUrl);
    return response.data;
  }

  async deactivateProfile(): Promise<void> {
    const response = await api.patch(`${this.baseUrl}/deactivate`);
    return response.data;
  }

  async reactivateProfile(): Promise<void> {
    await api.patch(`${this.baseUrl}/reactivate`);
  }
}

export const profileService = new ProfileService();
