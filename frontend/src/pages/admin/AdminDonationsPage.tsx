import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { donationsApi } from "@/api/donations";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { formatCell } from "@/lib/adminFormat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDonationsPage() {
  const [money, setMoney] = useState<Record<string, unknown>[]>([]);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<{ count?: number; total?: unknown } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [mRes, sRes, iRes] = await Promise.all([
          donationsApi.listMoney(),
          donationsApi.stats(),
          donationsApi.listItems(),
        ]);
        if (cancelled) return;
        setMoney((mRes.data ?? []) as Record<string, unknown>[]);
        setStats(sRes.data ?? null);
        setItems((iRes.data ?? []) as Record<string, unknown>[]);
      } catch (e) {
        if (!cancelled) toast.error("Không tải quyên góp", { description: e instanceof ApiError ? e.message : "" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalStr = stats?.total != null ? formatCell(stats.total) : "—";
  const countStr = stats?.count != null ? formatCell(stats.count) : "—";

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Quyên góp</h1>
        <p className="text-slate-400 text-sm mt-1">Tiền mặt (public list) và vật phẩm (Admin/TNV).</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-slate-900/90 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300 text-sm">Tổng số giao dịch tiền</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-[#f6931d]">{countStr}</CardContent>
        </Card>
        <Card className="bg-slate-900/90 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-300 text-sm">Tổng số tiền (đã ghi nhận)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-black text-emerald-400">{totalStr}</CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Tiền mặt gần đây</h2>
            <AdminDataTable rows={money} dense />
          </section>
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">Quyên góp vật phẩm</h2>
            {items.length === 0 ? (
              <p className="text-slate-500 text-sm">Không có dữ liệu hoặc thiếu quyền xem.</p>
            ) : (
              <AdminDataTable rows={items} dense />
            )}
          </section>
        </>
      )}
    </div>
  );
}
