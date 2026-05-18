import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { usersAdminApi, type UserRow } from "@/api/usersAdmin";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLES = ["User", "Volunteer", "Admin"] as const;

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<UserRow | null>(null);
  const [role, setRole] = useState("User");
  const [status, setStatus] = useState("1");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await usersAdminApi.list();
      setRows((res.data ?? []) as UserRow[]);
    } catch (e) {
      toast.error("Không tải user", { description: e instanceof ApiError ? e.message : "" });
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
      setRole(String(sel.role ?? "User"));
      setStatus(String(sel.status ?? 1));
    }
  }, [sel]);

  async function saveUser() {
    const id = sel?.user_id as number | undefined;
    if (id == null) return;
    setSaving(true);
    try {
      await usersAdminApi.update(Number(id), {
        role,
        status: parseInt(status, 10),
      });
      toast.success("Đã cập nhật");
      setSel(null);
      void load();
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(u: UserRow) {
    const id = u.user_id as number | undefined;
    if (id == null) return;
    if (!confirm(`Xóa user #${id}?`)) return;
    try {
      await usersAdminApi.delete(Number(id));
      toast.success("Đã xóa");
      void load();
    } catch (e) {
      toast.error("Không xóa được", { description: e instanceof ApiError ? e.message : "" });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Người dùng</h1>
        <p className="text-slate-400 text-sm mt-1">
          Bấm dòng để sửa vai trò/trạng thái. Xóa nếu cần (cẩn thận).
        </p>
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
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white">User #{String(sel.user_id)}</h2>
            <div>
              <Label className="text-slate-300">Vai trò</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full h-10 rounded-lg bg-slate-950 border border-slate-600 text-white px-3"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-slate-300">Trạng thái (1 hoạt động, 0 khóa)</Label>
              <Input
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 bg-slate-950 border-slate-600 text-white"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-between">
              <Button type="button" variant="destructive" onClick={() => void remove(sel)}>
                Xóa user
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSel(null)}>
                  Đóng
                </Button>
                <Button className="bg-[#2c5f51] text-white" disabled={saving} onClick={() => void saveUser()}>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
