import type { UserService } from "@/services/interfaces";
import type { User } from "@/types/userTypes";
import { defaultUser } from "@/data/demoUsers";
import { mockDelay } from "@/services/mockUtils";

export const mockUserService: UserService = {
  async getById(id: string): Promise<User> {
    await mockDelay(100);
    return { ...defaultUser, id };
  },
};
