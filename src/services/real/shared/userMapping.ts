import type { User } from "@/types/userTypes";

export type AppwritePrefs = {
  avatar?: string;
  bio?: string;
  role?: User["role"];
  socialLinks?: User["socialLinks"];
};

export type AppwriteAccount = {
  $id: string;
  name?: string;
  email?: string;
  registration?: number | string;
  $createdAt?: string;
  prefs?: AppwritePrefs;
};

export type UserDocument = {
  accountId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: User["role"];
  joinDate?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
};

function toDateOnly(value: unknown): string {
  if (typeof value === "number") {
    return new Date(value).toISOString().split("T")[0];
  }

  if (typeof value === "string") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  }

  return new Date().toISOString().split("T")[0];
}

export function toUserFromAccount(raw: AppwriteAccount, prefs?: AppwritePrefs): User {
  const mergedPrefs = { ...(raw.prefs ?? {}), ...(prefs ?? {}) };
  return {
    id: raw.$id,
    name: raw.name ?? "User",
    email: raw.email ?? "",
    avatar: mergedPrefs.avatar ?? "",
    bio: mergedPrefs.bio,
    joinDate: toDateOnly(raw.registration ?? raw.$createdAt),
    role: mergedPrefs.role === "admin" ? "admin" : "user",
    socialLinks: mergedPrefs.socialLinks,
  };
}

export function toUserFromDocument(doc: UserDocument): User {
  return {
    id: doc.accountId,
    name: doc.name,
    email: doc.email,
    avatar: doc.avatar ?? "",
    bio: doc.bio,
    joinDate: toDateOnly(doc.joinDate),
    role: doc.role === "admin" ? "admin" : "user",
    socialLinks: {
      twitter: doc.twitter || undefined,
      github: doc.github || undefined,
      linkedin: doc.linkedin || undefined,
      website: doc.website || undefined,
    },
  };
}

export function toUserDocumentData(user: User) {
  return {
    accountId: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    bio: user.bio || "",
    role: user.role,
    joinDate: new Date(user.joinDate).toISOString(),
    twitter: user.socialLinks?.twitter || "",
    github: user.socialLinks?.github || "",
    linkedin: user.socialLinks?.linkedin || "",
    website: user.socialLinks?.website || "",
  };
}
