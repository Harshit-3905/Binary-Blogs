import { account } from "@/lib/appwrite";

export async function getCurrentAccountId(): Promise<string | null> {
  try {
    const me = await account.get();
    return me.$id;
  } catch {
    return null;
  }
}

export async function requireCurrentAccountId(): Promise<string> {
  const id = await getCurrentAccountId();
  if (!id) throw new Error("Not authenticated");
  return id;
}

export function encodeOffsetCursor(offset: number): string {
  return btoa(JSON.stringify({ offset }));
}

export function decodeOffsetCursor(cursor?: string): number {
  if (!cursor) return 0;
  try {
    const parsed = JSON.parse(atob(cursor)) as { offset?: number };
    return Number.isFinite(parsed.offset) ? Math.max(0, parsed.offset ?? 0) : 0;
  } catch {
    return 0;
  }
}

export function toEpoch(value: string): number {
  const ts = Date.parse(value);
  return Number.isNaN(ts) ? Date.now() : ts;
}

export function readingTimeFromContent(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
