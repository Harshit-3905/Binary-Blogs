import type { UserService } from "@/services/interfaces";
import type { User } from "@/types/userTypes";
import { apiClient } from "@/lib/apiClient";

export const realUserService: UserService = {
  getById: (id: string) => apiClient.get<User>(`/users/${id}`),
};
