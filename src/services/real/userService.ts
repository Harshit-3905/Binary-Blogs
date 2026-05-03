import type { UserService } from "@/services/interfaces";
import type { User } from "@/types/userTypes";
import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwriteConfig";
import { type UserDocument, toUserFromDocument } from "./shared/userMapping";

const DATABASE_ID = appwriteConfig.databaseId;
const USERS_COLLECTION_ID = appwriteConfig.collections.users;

export const userService: UserService = {
  async getById(id: string): Promise<User> {
    const result = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: USERS_COLLECTION_ID,
      queries: [Query.equal("accountId", [id]), Query.limit(1)],
    });

    if (result.documents.length === 0) {
      throw new Error("User not found");
    }

    return toUserFromDocument(result.documents[0] as unknown as UserDocument);
  },
};
