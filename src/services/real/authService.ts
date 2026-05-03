import type { AuthService } from "@/services/interfaces";
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  SignupRequest,
  UpdateProfileRequest,
} from "@/types/apiTypes";
import type { User } from "@/types/userTypes";
import { ID } from "appwrite";
import { account, databases, storage } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwriteConfig";
import {
  type AppwriteAccount,
  type AppwritePrefs,
  toUserDocumentData,
  toUserFromAccount,
} from "./shared/userMapping";

const GUEST_EMAIL = "guest@example.com";
const GUEST_PASSWORD = "12345678";

function isUnauthenticated(err: unknown): boolean {
  const e = err as { code?: number; type?: string };
  return e?.code === 401 || e?.type === "general_unauthorized_scope";
}

function isSessionAlreadyActive(err: unknown): boolean {
  const e = err as { code?: number; type?: string; message?: string };
  const message = (e?.message ?? "").toLowerCase();
  return (
    e?.type === "user_session_already_exists" ||
    (e?.code === 409 && message.includes("session"))
  );
}

function isDocumentPermissionIssue(err: unknown): boolean {
  const e = err as { code?: number; type?: string; message?: string };
  const message = (e?.message ?? "").toLowerCase();
  if (e?.type === "general_unauthorized_scope") return true;
  if (e?.type === "general_access_forbidden") return true;
  if (e?.code === 401 || e?.code === 403) {
    return message.includes("permission") || message.includes("scope");
  }
  return false;
}

function isConflictError(err: unknown): boolean {
  const e = err as { code?: number; type?: string; message?: string };
  const message = (e?.message ?? "").toLowerCase();
  return e?.code === 409 || e?.type === "document_already_exists" || message.includes("already exists");
}

async function uploadAvatar(file: File, userId: string): Promise<string> {
  const uploaded = await storage.createFile({
    bucketId: appwriteConfig.buckets.images,
    fileId: ID.unique(),
    file,
    permissions: [
      `read("any")`,
      `update("user:${userId}")`,
      `delete("user:${userId}")`,
    ],
  });

  return storage
    .getFileView({
      bucketId: appwriteConfig.buckets.images,
      fileId: uploaded.$id,
    })
    .toString();
}

async function upsertUserDocument(user: User): Promise<void> {
  const data = toUserDocumentData(user);

  try {
    await databases.updateDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.collections.users,
      documentId: user.id,
      data,
    });
    return;
  } catch (err) {
    const e = err as { code?: number };
    if (e?.code !== 404) throw err;
  }

  try {
    await databases.createDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.collections.users,
      documentId: user.id,
      data,
      permissions: [
        `read("any")`,
        `update("user:${user.id}")`,
        `delete("user:${user.id}")`,
      ],
    });
  } catch (err) {
    // Handles duplicate create races (double click, strict mode, retries).
    if (!isConflictError(err)) throw err;
    await databases.updateDocument({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.collections.users,
      documentId: user.id,
      data,
    });
  }
}

async function getUserFromSession(): Promise<User> {
  const me = (await account.get()) as AppwriteAccount;

  let prefs: AppwritePrefs | undefined;
  try {
    prefs = (await account.getPrefs()) as AppwritePrefs;
  } catch {
    prefs = undefined;
  }

  const user = toUserFromAccount(me, prefs);
  try {
    await upsertUserDocument(user);
  } catch (err) {
    // Keep auth usable even when the profile collection's create/update
    // permissions are not fully opened yet during staged rollout.
    if (!isDocumentPermissionIssue(err)) throw err;
  }
  return user;
}

export const authService: AuthService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      await account.createEmailPasswordSession({
        email: payload.email,
        password: payload.password,
      });
    } catch (err) {
      if (!isSessionAlreadyActive(err)) throw err;
    }
    return { user: await getUserFromSession() };
  },

  async signup(payload: SignupRequest): Promise<AuthResponse> {
    await account.create({
      userId: ID.unique(),
      email: payload.email,
      password: payload.password,
      name: payload.name,
    });
    await account.createEmailPasswordSession({
      email: payload.email,
      password: payload.password,
    });

    if (payload.avatarFile) {
      const me = await account.get();
      const avatar = await uploadAvatar(payload.avatarFile, me.$id);
      await account.updatePrefs({ prefs: { avatar } });
    }

    return { user: await getUserFromSession() };
  },

  async guestLogin(): Promise<AuthResponse> {
    try {
      await account.createEmailPasswordSession({
        email: GUEST_EMAIL,
        password: GUEST_PASSWORD,
      });
    } catch (err) {
      if (!isSessionAlreadyActive(err)) throw err;

      const current = await account.get();
      if ((current.email ?? "").toLowerCase() !== GUEST_EMAIL) {
        await account.deleteSession({ sessionId: "current" });
        await account.createEmailPasswordSession({
          email: GUEST_EMAIL,
          password: GUEST_PASSWORD,
        });
      }
    }
    return { user: await getUserFromSession() };
  },

  async logout(): Promise<void> {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (err) {
      if (!isUnauthenticated(err)) throw err;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await getUserFromSession();
    } catch (err) {
      if (isUnauthenticated(err)) return null;
      throw err;
    }
  },

  async updateProfile(payload: UpdateProfileRequest): Promise<User> {
    if (payload.name) {
      await account.updateName({ name: payload.name });
    }

    const currentPrefs = (await account.getPrefs()) as AppwritePrefs;
    const nextPrefs: AppwritePrefs = { ...currentPrefs };

    if (payload.avatar !== undefined) nextPrefs.avatar = payload.avatar;
    if (payload.bio !== undefined) nextPrefs.bio = payload.bio;
    if (payload.socialLinks !== undefined) {
      nextPrefs.socialLinks = payload.socialLinks;
    }

    await account.updatePrefs({ prefs: nextPrefs });
    return getUserFromSession();
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await account.updatePassword({
      password: payload.newPassword,
      oldPassword: payload.currentPassword,
    });
  },
};
