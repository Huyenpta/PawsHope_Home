import { api } from "@/lib/api";

export type KennelRow = Record<string, unknown>;

export const kennelsApi = {
  list: () => api.get<KennelRow[]>("/kennels"),

  getOne: (id: number) => api.get<KennelRow>(`/kennels/${id}`),

  create: (body: { name: string; capacity: number; description?: string }) =>
    api.post<{ kennelId: number }>("/kennels", body),

  update: (id: number, body: { name?: string; capacity?: number; description?: string }) =>
    api.patch(`/kennels/${id}`, body),

  delete: (id: number) => api.delete(`/kennels/${id}`),
};
