import { api } from "@/lib/api";
import type { RescueReport } from "@/types/rescue";

export interface RescueReportCreateInput {
  reporterName?: string;
  reporterPhone: string;
  locationText: string;
  description?: string;
}

export interface RescueStats {
  Pending: number;
  "In Progress": number;
  Rescued: number;
  Failed: number;
  total: number;
}

export interface RescueReportFromApi {
  reportId: number;
  userId: number | null;
  reporterName: string | null;
  reporterPhone: string;
  locationText: string;
  description: string | null;
  imageUrl: string | null;
  status: RescueReport["status"];
  assignedTo: number | null;
  assignedUserName: string | null;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
}

export const rescueApi = {
  create: (input: RescueReportCreateInput) =>
    api.post<RescueReportFromApi>("/rescue-reports", input, { skipAuth: true }),

  trackByCode: (code: string) =>
    api.get<{
      trackingCode: string;
      status: RescueReport["status"];
      locationText: string;
      createdAt: string;
      updatedAt: string;
    }>(`/rescue-reports/track/${encodeURIComponent(code)}`, { skipAuth: true }),

  list: (params?: {
    status?: RescueReport["status"];
    assignedTo?: number;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.assignedTo != null) qs.set("assignedTo", String(params.assignedTo));
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const query = qs.toString();
    /** Backend trả `{ success, items, pagination }` — không có `data`. */
    return api.get(`/rescue-reports${query ? `?${query}` : ""}`) as Promise<{
      success: boolean;
      items: RescueReportFromApi[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>;
  },

  stats: () => api.get<RescueStats>("/rescue-reports/stats"),

  publicStats: () => api.get<RescueStats>("/rescue-reports/public-stats", { skipAuth: true }),

  getById: (id: number) => api.get<RescueReportFromApi>(`/rescue-reports/${id}`),

  update: (id: number, body: { status?: RescueReport["status"]; assignedTo?: number | null }) =>
    api.patch<RescueReportFromApi>(`/rescue-reports/${id}`, body),

  delete: (id: number) => api.delete(`/rescue-reports/${id}`),
};
