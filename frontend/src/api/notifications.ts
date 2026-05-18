import { api } from "@/lib/api";

export type NotificationRow = Record<string, unknown>;

export const notificationsApi = {
  list: () => api.get<NotificationRow[]>("/notifications"),

  unreadCount: () => api.get<{ count: number }>("/notifications/unread-count"),

  markRead: (id: number) => api.patch(`/notifications/${id}/read`, {}),

  markAllRead: () => api.patch("/notifications/read-all", {}),
};
