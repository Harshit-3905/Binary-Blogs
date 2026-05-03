import type { PreferencesService } from "@/services/interfaces";
import type {
  UpdatePreferencesRequest,
  UserPreferences,
} from "@/types/preferencesTypes";
import { Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwriteConfig";
import { demoPreferences } from "@/data/demoPreferences";
import { requireCurrentAccountId } from "./shared/serviceUtils";

type PreferencesDocument = {
  $id: string;
  userId: string;
  appearanceTheme: UserPreferences["appearance"]["theme"];
  appearanceColorScheme: string;
  appearanceFontFamily: UserPreferences["appearance"]["fontFamily"];
  notificationsEmail: boolean;
  notificationsComments: boolean;
  notificationsMentions: boolean;
  notificationsNewsletter: boolean;
  privacyProfileVisible: boolean;
  privacyAnalytics: boolean;
  privacyTwoFactor: boolean;
  contentAutoSave: boolean;
  contentCodeHighlighting: boolean;
  contentWysiwyg: boolean;
};

const DATABASE_ID = appwriteConfig.databaseId;
const PREFERENCES_COLLECTION_ID = appwriteConfig.collections.preferences;

function isConflictError(err: unknown): boolean {
  const e = err as { code?: number; type?: string; message?: string };
  const message = (e?.message ?? "").toLowerCase();
  return e?.code === 409 || e?.type === "document_already_exists" || message.includes("already exists");
}

function mergePreferences(
  current: UserPreferences,
  patch: UpdatePreferencesRequest
): UserPreferences {
  return {
    appearance: { ...current.appearance, ...(patch.appearance ?? {}) },
    notifications: { ...current.notifications, ...(patch.notifications ?? {}) },
    privacy: { ...current.privacy, ...(patch.privacy ?? {}) },
    content: { ...current.content, ...(patch.content ?? {}) },
  };
}

function toDomain(doc: PreferencesDocument): UserPreferences {
  return {
    appearance: {
      theme: doc.appearanceTheme,
      colorScheme: doc.appearanceColorScheme,
      fontFamily: doc.appearanceFontFamily,
    },
    notifications: {
      email: doc.notificationsEmail,
      comments: doc.notificationsComments,
      mentions: doc.notificationsMentions,
      newsletter: doc.notificationsNewsletter,
    },
    privacy: {
      profileVisible: doc.privacyProfileVisible,
      analytics: doc.privacyAnalytics,
      twoFactor: doc.privacyTwoFactor,
    },
    content: {
      autoSave: doc.contentAutoSave,
      codeHighlighting: doc.contentCodeHighlighting,
      wysiwyg: doc.contentWysiwyg,
    },
  };
}

function toStorageData(userId: string, prefs: UserPreferences) {
  return {
    userId,
    appearanceTheme: prefs.appearance.theme,
    appearanceColorScheme: prefs.appearance.colorScheme,
    appearanceFontFamily: prefs.appearance.fontFamily,
    notificationsEmail: prefs.notifications.email,
    notificationsComments: prefs.notifications.comments,
    notificationsMentions: prefs.notifications.mentions,
    notificationsNewsletter: prefs.notifications.newsletter,
    privacyProfileVisible: prefs.privacy.profileVisible,
    privacyAnalytics: prefs.privacy.analytics,
    privacyTwoFactor: prefs.privacy.twoFactor,
    contentAutoSave: prefs.content.autoSave,
    contentCodeHighlighting: prefs.content.codeHighlighting,
    contentWysiwyg: prefs.content.wysiwyg,
  };
}

async function getPreferencesDocument(
  userId: string
): Promise<PreferencesDocument | null> {
  const list = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: PREFERENCES_COLLECTION_ID,
    queries: [Query.equal("userId", [userId]), Query.limit(1)],
  });

  if (list.documents.length === 0) return null;
  return list.documents[0] as unknown as PreferencesDocument;
}

async function ensurePreferences(userId: string): Promise<PreferencesDocument> {
  const existing = await getPreferencesDocument(userId);
  if (existing) return existing;

  try {
    const created = await databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: PREFERENCES_COLLECTION_ID,
      documentId: userId,
      data: toStorageData(userId, demoPreferences),
      permissions: [
        `read("user:${userId}")`,
        `update("user:${userId}")`,
        `delete("user:${userId}")`,
      ],
    });

    return created as unknown as PreferencesDocument;
  } catch (err) {
    if (!isConflictError(err)) throw err;
    const retry = await getPreferencesDocument(userId);
    if (!retry) throw err;
    return retry;
  }
}

export const preferencesService: PreferencesService = {
  async get(): Promise<UserPreferences> {
    const userId = await requireCurrentAccountId();
    const doc = await ensurePreferences(userId);
    return toDomain(doc);
  },

  async update(payload: UpdatePreferencesRequest): Promise<UserPreferences> {
    const userId = await requireCurrentAccountId();
    const currentDoc = await ensurePreferences(userId);
    const merged = mergePreferences(toDomain(currentDoc), payload);

    const updated = await databases.updateDocument({
      databaseId: DATABASE_ID,
      collectionId: PREFERENCES_COLLECTION_ID,
      documentId: currentDoc.$id,
      data: toStorageData(userId, merged),
    });

    return toDomain(updated as unknown as PreferencesDocument);
  },
};
