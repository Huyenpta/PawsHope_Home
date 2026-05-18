import { api } from "@/lib/api";

export type ExpenseRow = Record<string, unknown>;

export const expensesApi = {
  list: () => api.get<ExpenseRow[]>("/expenses"),

  summary: () => api.get<Record<string, unknown>>("/expenses/summary"),
};
