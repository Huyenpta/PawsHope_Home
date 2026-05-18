import { api } from "@/lib/api";

export type DonationMoneyRow = Record<string, unknown>;
export type DonationItemRow = Record<string, unknown>;

export const donationsApi = {
  listMoney: () => api.get<DonationMoneyRow[]>("/donations"),

  stats: () =>
    api.get<{ count?: number; total?: unknown }>("/donations/stats"),

  listItems: () => api.get<DonationItemRow[]>("/donations/items"),
};
