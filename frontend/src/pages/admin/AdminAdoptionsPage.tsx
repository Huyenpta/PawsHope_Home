import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { adoptionsApi, type AdoptionRow } from "@/api/adoptions";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STATUSES = ["Pending", "Interviewing", "Approved", "Rejected"] as const;

export default function AdminAdoptionsPage() {
  const [rows, setRows] = useState<AdoptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<AdoptionRow | null>(null);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("Pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await adoptionsApi.list();
      setRows((res.data ?? []) as AdoptionRow[]);
    } catch (e) {
      toast.error("Không tải đơn nhận nuôi", { description: e instanceof ApiError ? e.message : "" });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (sel) {
      const s = sel.status as string | undefined;
      if (s && STATUSES.includes(s as (typeof STATUSES)[number])) {
        setStatus(s as (typeof STATUSES)[number]);
      }
      setNotes((sel.notes as string) ?? "");
    }
  }, [sel]);

  async function saveReview() {
    const id = sel?.adoption_id as number | undefined;
    if (id == null) return;
    setSaving(true);
    try {
      await adoptionsApi.review(Number(id), { status, notes: notes || undefined });
      toast.success("Đã cập nhật đơn");
      setSel(null);
      void load();
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Đơn nhận nuôi</h1>
        <p className="text-slate-400 text-sm mt-1">Bấm dòng để duyệt / cập nhật trạng thái.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <AdminDataTable rows={rows} onRowClick={(r) => setSel(r)} />
      )}

      {sel && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <h2 className="text-lg font-bold text-white">Đơn #{String(sel.adoption_id)}</h2>
            <p className="text-sm text-slate-400">
              Pet: {String(sel.pet_name ?? "")} — Người đăng ký: {String(sel.user_name ?? "")}
            </p>
            <div>
              <Label className="text-slate-300">Trạng thái</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as (typeof STATUSES)[number])}
                className="mt-1 w-full h-10 rounded-lg bg-slate-950 border border-slate-600 text-white px-3"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-300">Ghi chú</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-600 text-white px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSel(null)}>
                Đóng
              </Button>
              <Button className="bg-[#2c5f51] text-white" disabled={saving} onClick={() => void saveReview()}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
