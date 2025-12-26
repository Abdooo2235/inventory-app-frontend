import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";
import type {
  ProfileUpdateFormData,
  PasswordChangeFormData,
} from "@/schemas/profileSchema";

// Profile API mutations
export const profileApi = {
  updateProfile: async (data: ProfileUpdateFormData) => {
    const response = await api.put(ENDPOINTS.PROFILE.UPDATE, data);
    return response.data;
  },

  changePassword: async (data: PasswordChangeFormData) => {
    const response = await api.post(ENDPOINTS.PROFILE.CHANGE_PASSWORD, {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      new_password_confirmation: data.confirmPassword,
    });
    return response.data;
  },
};
