const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "pawshope_token";

export const auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  details?: unknown;
  /** Dùng với các endpoint paginated ({ success, items, pagination }) */
  items?: unknown[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function request<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<ApiResponse<T>> {
  const { skipAuth, headers, ...rest } = options;
  const token = !skipAuth ? auth.getToken() : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const json = (await res.json().catch(() => ({}))) as ApiResponse<T> & {
    message?: string;
  };

  if (!res.ok) {
    throw new ApiError(res.status, json.message || `HTTP ${res.status}`, json.details);
  }
  return json;
}

export const api = {
  get: <T>(path: string, opts?: RequestInit & { skipAuth?: boolean }) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestInit & { skipAuth?: boolean }) =>
    request<T>(path, { ...opts, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown, opts?: RequestInit & { skipAuth?: boolean }) =>
    request<T>(path, { ...opts, method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, opts?: RequestInit & { skipAuth?: boolean }) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
