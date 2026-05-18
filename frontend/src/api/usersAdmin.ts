import { api } from "@/lib/api";

export type UserRow = Record<string, unknown>;

export const usersAdminApi = {
  list: () => api.get<UserRow[]>("/users"),

  update: (
    id: number,
    body: {
      fullName?: string;
      email?: string;
      phone?: string;
      role?: string;
      status?: number;
    },
  ) => api.patch(`/users/${id}`, body),

  delete: (id: number) => api.delete(`/users/${id}`),
};
