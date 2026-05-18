import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { ordersApi, type OrderRow } from "@/api/orders";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const res = await ordersApi.list();
        if (!c) setRows((res.data ?? []) as OrderRow[]);
      } catch (e) {
        if (!c) {
          toast.error("Không tải đơn hàng", { description: e instanceof ApiError ? e.message : "" });
          setRows([]);
        }
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Đơn hàng</h1>
        <p className="text-slate-400 text-sm mt-1">Toàn bộ đơn — chỉ Admin.</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <div className="space-y-4">
          <AdminDataTable
            rows={rows}
            onRowClick={(r) => navigate(`/admin/orders/${String(r.order_id)}`)}
          />
        </div>
      )}
    </div>
  );
}
