import { api } from "@/lib/api";

export type VolunteerApplicationRow = Record<string, unknown>;

export const volunteerApplicationsApi = {
  list: () => api.get<VolunteerApplicationRow[]>("/volunteer-applications"),

  review: (id: number, status: "Approved" | "Rejected") =>
    api.patch(`/volunteer-applications/${id}`, { status }),
};
