import type { User } from "@/types/userTypes";

export interface UserService {
  getById(id: string): Promise<User>;
}
