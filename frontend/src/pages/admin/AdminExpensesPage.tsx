import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { expensesApi } from "@/api/expenses";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { formatCell } from "@/lib/adminFormat";

export default function AdminExpensesPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const [l, s] = await Promise.all([expensesApi.list(), expensesApi.summary()]);
        if (!c) {
          setRows((l.data ?? []) as Record<string, unknown>[]);
          setSummary((s.data as Record<string, unknown>) ?? null);
        }
      } catch (e) {
        if (!c) toast.error("Không tải chi phí", { description: e instanceof ApiError ? e.message : "" });
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
        <h1 className="text-2xl font-black text-white tracking-tight">Chi phí</h1>
        <p className="text-slate-400 text-sm mt-1">Chỉ Admin — nguồn API `/api/expenses`.</p>
      </div>

      {summary && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300 font-mono">
          {formatCell(summary)}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <AdminDataTable rows={rows} />
      )}
    </div>
  );
}
