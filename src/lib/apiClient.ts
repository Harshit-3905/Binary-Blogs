/**
 * Thin fetch wrapper used by the real service layer.
 *
 * Auth is handled via an httpOnly, Secure, SameSite cookie set by the backend
 * on `/auth/login` / `/auth/signup` / `/auth/guest`. Every request below uses
 * `credentials: "include"` so the cookie is sent automatically; the frontend
 * never reads or stores tokens itself (avoids XSS-via-localStorage exposure).
 * Logout calls `/auth/logout` which clears the cookie server-side.
 *
 * Configuration (Vite env, see .env.example):
 *   VITE_API_BASE_URL  – e.g. "https://api.binaryblogs.dev" (no trailing slash)
 *   VITE_USE_MOCK_API  – "true" while the backend is not available; the
 *                        service barrel swaps in mock implementations.
 */

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";
export const USE_MOCK_API: boolean =
  (import.meta.env.VITE_USE_MOCK_API ?? "true") === "true";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type Query = Record<string, string | number | boolean | string[] | undefined>;

function buildUrl(path: string, query?: Query): string {
  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE_URL}${path}`
  );
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; query?: Query } = {}
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(buildUrl(path, options.query), {
    method,
    headers,
    // Send the auth cookie on every request and accept Set-Cookie on the way
    // back so the browser stores it.
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, query?: Query) => request<T>("GET", path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, { body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>("PATCH", path, { body }),
  del: <T>(path: string) => request<T>("DELETE", path),
};
