import { api } from "@/lib/api";

export type AdoptionRow = Record<string, unknown>;

export const adoptionsApi = {
  list: () => api.get<AdoptionRow[]>("/adoptions"),

  review: (id: number, body: { status: "Pending" | "Interviewing" | "Approved" | "Rejected"; notes?: string }) =>
    api.patch(`/adoptions/${id}`, body),
};
