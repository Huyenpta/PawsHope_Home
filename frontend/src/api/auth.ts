import { api, auth } from "@/lib/api";

const USER_KEY = "pawshope_user";

export interface AuthUser {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: number;
  createdAt: string;
}

export interface LoginPayload {
  user: AuthUser;
  token: string;
}

export function canAccessAdmin(role: string): boolean {
  return role === "Admin" || role === "Volunteer";
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  auth.clearToken();
  localStorage.removeItem(USER_KEY);
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginPayload>("/auth/login", { username, password }, { skipAuth: true }),

  /** Gọi sau khi login API trả success — lưu token + user */
  persistSession(payload: LoginPayload): void {
    auth.setToken(payload.token);
    setStoredUser(payload.user);
  },
};
