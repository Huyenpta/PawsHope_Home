import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { ordersApi, type OrderDetail } from "@/api/orders";
import { ApiError } from "@/lib/api";
import { formatCell } from "@/lib/adminFormat";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";

const STATUSES = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"] as const;

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : NaN;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("Pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(orderId)) return;
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const res = await ordersApi.getOne(orderId);
        if (!c && res.data) {
          setOrder(res.data as OrderDetail);
          const os = res.data.order_status as string | undefined;
          if (os && STATUSES.includes(os as (typeof STATUSES)[number])) {
            setStatus(os as (typeof STATUSES)[number]);
          }
        }
      } catch (e) {
        if (!c) toast.error("Không tải đơn", { description: e instanceof ApiError ? e.message : "" });
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [orderId]);

  async function saveStatus() {
    if (!Number.isFinite(orderId)) return;
    setSaving(true);
    try {
      await ordersApi.updateStatus(orderId, status);
      toast.success("Đã cập nhật trạng thái");
      const res = await ordersApi.getOne(orderId);
      if (res.data) setOrder(res.data as OrderDetail);
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    } finally {
      setSaving(false);
    }
  }

  const items = (order?.items as Record<string, unknown>[] | undefined) ?? [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/orders" className="text-sm text-[#f6931d] hover:underline">
          ← Danh sách đơn
        </Link>
      </div>
      <h1 className="text-2xl font-black text-white tracking-tight">Đơn #{id}</h1>

      {loading ? (
        <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
      ) : !order ? (
        <p className="text-slate-500">Không tìm thấy đơn.</p>
      ) : (
        <>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {Object.entries(order)
              .filter(([k]) => k !== "items")
              .map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-900/80 border border-slate-800 p-3">
                  <dt className="text-slate-500 text-xs uppercase">{k}</dt>
                  <dd className="text-slate-100 font-mono text-sm mt-1">{formatCell(v)}</dd>
                </div>
              ))}
          </dl>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Sản phẩm</h2>
            {items.length === 0 ? (
              <p className="text-slate-500 text-sm">Không có dòng item.</p>
            ) : (
              <AdminDataTable rows={items} dense />
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
            <label className="text-sm text-slate-300 font-medium">Đổi trạng thái đơn</label>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
                className="h-10 rounded-lg bg-slate-950 border border-slate-600 text-white px-3"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                className="bg-[#2c5f51] text-white"
                disabled={saving}
                onClick={() => void saveStatus()}
              >
                Lưu trạng thái
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
