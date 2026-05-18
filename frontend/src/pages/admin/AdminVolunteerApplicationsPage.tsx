import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { volunteerApplicationsApi, type VolunteerApplicationRow } from "@/api/volunteerApplications";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";

export default function AdminVolunteerApplicationsPage() {
  const [rows, setRows] = useState<VolunteerApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await volunteerApplicationsApi.list();
      setRows((res.data ?? []) as VolunteerApplicationRow[]);
    } catch (e) {
      toast.error("Không tải đơn TNV", { description: e instanceof ApiError ? e.message : "" });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function review(row: VolunteerApplicationRow, status: "Approved" | "Rejected") {
    const id = row.application_id as number | undefined;
    if (id == null) return;
    try {
      await volunteerApplicationsApi.review(Number(id), status);
      toast.success(status === "Approved" ? "Đã duyệt" : "Đã từ chối");
      void load();
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Đơn đăng ký tình nguyện</h1>
        <p className="text-slate-400 text-sm mt-1">Duyệt/từ chối hồ sơ — chỉ Admin.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <div className="space-y-4">
          <AdminDataTable rows={rows} />
          <div className="flex flex-wrap gap-2">
            {rows.map((r) => (
              <div key={String(r.application_id)} className="flex gap-2 items-center border border-slate-800 rounded-lg p-2">
                <span className="text-slate-500 text-xs font-mono">#{String(r.application_id)}</span>
                <Button
                  size="sm"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white"
                  onClick={() => void review(r, "Approved")}
                >
                  Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void review(r, "Rejected")}
                >
                  Từ chối
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
