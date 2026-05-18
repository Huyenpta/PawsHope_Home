import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import type { RescueReportFromApi } from "@/api/rescue";
import { rescueApi } from "@/api/rescue";
import type { RescueStatus } from "@/types/rescue";
import { RESCUE_STATUS_LABEL } from "@/types/rescue";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUSES: RescueStatus[] = ["Pending", "In Progress", "Rescued", "Failed"];

function formatDt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

interface RescueReportInspectorProps {
  report: RescueReportFromApi | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  allowDelete: boolean;
}

export function RescueReportInspector({
  report,
  open,
  onClose,
  onSaved,
  allowDelete,
}: RescueReportInspectorProps) {
  const [status, setStatus] = useState<RescueStatus>("Pending");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (report) setStatus(report.status);
  }, [report]);

  if (!open || !report) return null;

  const activeReport = report;

  async function saveStatus() {
    if (status === activeReport.status) {
      toast.message("Không có thay đổi");
      return;
    }
    setSaving(true);
    try {
      await rescueApi.update(activeReport.reportId, { status });
      toast.success("Đã cập nhật trạng thái");
      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Lỗi không xác định";
      toast.error("Cập nhật thất bại", { description: msg });
    } finally {
      setSaving(false);
    }
  }

  async function removeReport() {
    if (
      !confirm(
        `Xóa vĩnh viễn ca #${activeReport.reportId} (${activeReport.trackingCode})? Thao tác không hoàn tác.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await rescueApi.delete(activeReport.reportId);
      toast.success("Đã xóa báo cáo");
      onSaved();
      onClose();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Lỗi không xác định";
      toast.error("Xóa thất bại", { description: msg });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 p-5 border-b border-slate-800 bg-slate-900 z-10">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Chi tiết báo cáo
            </p>
            <h2 className="text-xl font-black text-white font-mono mt-1">{activeReport.trackingCode}</h2>
            <Badge variant="outline" className="mt-2 border-slate-600 text-slate-300">
              {RESCUE_STATUS_LABEL[activeReport.status]}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm">
          <dl className="grid gap-3">
            <div>
              <dt className="text-slate-500 text-xs uppercase tracking-wide">Người báo cáo</dt>
              <dd className="text-slate-100 mt-0.5">{activeReport.reporterName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500 text-xs uppercase tracking-wide">Điện thoại</dt>
              <dd className="text-slate-100 mt-0.5 font-mono">{activeReport.reporterPhone}</dd>
            </div>
            <div>
              <dt className="text-slate-500 text-xs uppercase tracking-wide">Địa điểm</dt>
              <dd className="text-slate-100 mt-0.5 whitespace-pre-wrap">{activeReport.locationText}</dd>
            </div>
            <div>
              <dt className="text-slate-500 text-xs uppercase tracking-wide">Mô tả</dt>
              <dd className="text-slate-100 mt-0.5 whitespace-pre-wrap">{activeReport.description ?? "—"}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Tạo lúc</dt>
                <dd className="text-slate-300 mt-0.5">{formatDt(activeReport.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500 text-xs uppercase tracking-wide">Cập nhật</dt>
                <dd className="text-slate-300 mt-0.5">{formatDt(activeReport.updatedAt)}</dd>
              </div>
            </div>
            <div>
              <dt className="text-slate-500 text-xs uppercase tracking-wide">Người được gán</dt>
              <dd className="text-slate-100 mt-0.5">
                {activeReport.assignedUserName ??
                  (activeReport.assignedTo != null ? `#${activeReport.assignedTo}` : "—")}
              </dd>
            </div>
          </dl>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label htmlFor="rescue-status" className="block text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Trạng thái mới
            </label>
            <select
              id="rescue-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as RescueStatus)}
              className="w-full h-11 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 px-3 focus:outline-none focus:ring-2 focus:ring-[#f6931d]/50"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {RESCUE_STATUS_LABEL[st]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-800"
              onClick={onClose}
            >
              Đóng
            </Button>
            <Button
              type="button"
              disabled={saving}
              className="flex-1 bg-[#2c5f51] hover:bg-[#245045] text-white font-semibold"
              onClick={() => void saveStatus()}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu trạng thái"}
            </Button>
          </div>

          {allowDelete && (
            <div className="pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="destructive"
                className="w-full font-semibold"
                disabled={deleting}
                onClick={() => void removeReport()}
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Xóa báo cáo (Admin)"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
