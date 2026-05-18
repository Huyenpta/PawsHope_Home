import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { kennelsApi, type KennelRow } from "@/api/kennels";
import { getStoredUser } from "@/api/auth";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminKennelsPage() {
  const isAdmin = getStoredUser()?.role === "Admin";

  const [rows, setRows] = useState<KennelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("10");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await kennelsApi.list();
      setRows((res.data ?? []) as KennelRow[]);
    } catch (e) {
      toast.error("Không tải được chuồng", { description: e instanceof ApiError ? e.message : "" });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createKennel() {
    const cap = parseInt(capacity, 10);
    if (!name.trim() || !Number.isFinite(cap) || cap < 1) {
      toast.error("Kiểm tra tên và sức chứa");
      return;
    }
    setSaving(true);
    try {
      await kennelsApi.create({ name: name.trim(), capacity: cap, description: description || undefined });
      toast.success("Đã tạo chuồng");
      setShow(false);
      setName("");
      setCapacity("10");
      setDescription("");
      void load();
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    } finally {
      setSaving(false);
    }
  }

  async function removeRow(row: KennelRow) {
    const id = row.kennel_id as number | undefined;
    if (id == null || !isAdmin) return;
    if (!confirm(`Xóa chuồng #${id}?`)) return;
    try {
      await kennelsApi.delete(Number(id));
      toast.success("Đã xóa");
      void load();
    } catch (e) {
      toast.error("Không xóa được", { description: e instanceof ApiError ? e.message : "" });
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Chuồng trại</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin ? "Admin: bấm dòng để xóa. Tạo / sửa chuồng cần quyền Admin." : "Xem sức chứa và tải hiện tại."}
          </p>
        </div>
        {isAdmin && (
          <Button className="bg-[#2c5f51] hover:bg-[#245045] text-white" onClick={() => setShow(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm chuồng
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <AdminDataTable rows={rows} onRowClick={isAdmin ? (r) => void removeRow(r) : undefined} />
      )}

      {show && isAdmin && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-3">
            <h2 className="text-lg font-bold text-white">Chuồng mới</h2>
            <div>
              <Label className="text-slate-300">Tên</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-950 border-slate-600 text-white mt-1" />
            </div>
            <div>
              <Label className="text-slate-300">Sức chứa</Label>
              <Input
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                type="number"
                min={1}
                className="bg-slate-950 border-slate-600 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-300">Mô tả</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-950 border-slate-600 text-white mt-1" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShow(false)}>
                Huỷ
              </Button>
              <Button className="bg-[#f6931d] text-white" disabled={saving} onClick={() => void createKennel()}>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
