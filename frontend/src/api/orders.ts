import { api } from "@/lib/api";

export type OrderRow = Record<string, unknown>;
export type OrderDetail = OrderRow & { items?: Record<string, unknown>[] };

export const ordersApi = {
  list: () => api.get<OrderRow[]>("/orders"),

  getOne: (id: number) => api.get<OrderDetail>(`/orders/${id}`),

  updateStatus: (id: number, status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled") =>
    api.patch(`/orders/${id}/status`, { status }),
};
