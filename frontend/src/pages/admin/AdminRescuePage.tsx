import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Filter, Loader2, RefreshCw } from "lucide-react";

import type { RescueReportFromApi } from "@/api/rescue";
import { rescueApi } from "@/api/rescue";
import { getStoredUser } from "@/api/auth";
import type { RescueStatus } from "@/types/rescue";
import { RESCUE_STATUS_LABEL } from "@/types/rescue";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RescueReportInspector } from "@/components/admin/RescueReportInspector";

function statusBadgeClass(status: RescueStatus): string {
  switch (status) {
    case "Pending":
      return "bg-amber-500/15 text-amber-300 border-amber-500/30";
    case "In Progress":
      return "bg-sky-500/15 text-sky-300 border-sky-500/30";
    case "Rescued":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    case "Failed":
      return "bg-red-500/15 text-red-300 border-red-500/30";
    default:
      return "bg-slate-500/15 text-slate-300 border-slate-500/30";
  }
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}…`;
}

export default function AdminRescuePage() {
  const allowDelete = getStoredUser()?.role === "Admin";

  const [items, setItems] = useState<RescueReportFromApi[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<RescueReportFromApi | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await rescueApi.list({
        page,
        limit,
        ...(statusFilter ? { status: statusFilter as RescueStatus } : {}),
      });
      setItems(res.items ?? []);
      const pg = res.pagination;
      if (pg) {
        setTotalPages(Math.max(1, pg.totalPages));
        setTotal(pg.total);
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Không tải được danh sách.";
      toast.error("Lỗi", { description: msg });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Ca cứu hộ</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {total} báo cáo{statusFilter ? ` · lọc: ${RESCUE_STATUS_LABEL[statusFilter as RescueStatus]}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="h-10 min-w-[180px] rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-[#f6931d]/40"
            >
              <option value="">Tất cả trạng thái</option>
              {(Object.keys(RESCUE_STATUS_LABEL) as RescueStatus[]).map((st) => (
                <option key={st} value={st}>
                  {RESCUE_STATUS_LABEL[st]}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-200 hover:bg-slate-800"
            disabled={loading}
            onClick={() => void load()}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Mã tra cứu</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Liên hệ</th>
                <th className="px-4 py-3 font-semibold min-w-[200px]">Địa điểm</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <Loader2 className="w-8 h-8 text-[#f6931d] animate-spin mx-auto opacity-80" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                    Không có báo cáo nào phù hợp.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.reportId}
                    className="border-b border-slate-800/80 hover:bg-slate-800/40 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelected(row);
                      setInspectorOpen(true);
                    }}
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-[#f6931d] whitespace-nowrap">
                      {row.trackingCode}
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      <div className="font-medium">{row.reporterName ?? "Khách"}</div>
                      <div className="text-slate-500 font-mono text-xs">{row.reporterPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs">{truncate(row.locationText, 72)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className={statusBadgeClass(row.status)}>
                        {RESCUE_STATUS_LABEL[row.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs">
                      {new Date(row.updatedAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && items.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-800 bg-slate-900/80">
            <p className="text-xs text-slate-500">
              Trang {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                className="border-slate-700 text-slate-200"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                className="border-slate-700 text-slate-200"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <RescueReportInspector
        report={selected}
        open={inspectorOpen}
        onClose={() => {
          setInspectorOpen(false);
          setSelected(null);
        }}
        onSaved={() => void load()}
        allowDelete={allowDelete}
      />
    </div>
  );
}
