import { api } from "@/lib/api";

export type PetRow = Record<string, unknown>;

export const petsApi = {
  list: (params?: {
    species?: string;
    status?: string;
    kennelId?: number;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.species) qs.set("species", params.species);
    if (params?.status) qs.set("status", params.status);
    if (params?.kennelId != null) qs.set("kennelId", String(params.kennelId));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return api.get(`/pets${q ? `?${q}` : ""}`) as Promise<{
      success: boolean;
      items: PetRow[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>;
  },

  getOne: (id: number) => api.get<PetRow>(`/pets/${id}`),

  create: (body: {
    name?: string;
    species?: string;
    breed?: string;
    ageMonths?: number;
    status?: string;
    imageUrl?: string;
    kennelId?: number | null;
    fromReportId?: number | null;
    intakeDate?: string;
    description?: string;
  }) => api.post<{ petId: number }>("/pets", body),

  update: (id: number, body: Record<string, unknown>) => api.patch(`/pets/${id}`, body),

  delete: (id: number) => api.delete(`/pets/${id}`),
};
