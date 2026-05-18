import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";

import { petsApi, type PetRow } from "@/api/pets";
import { getStoredUser } from "@/api/auth";
import { ApiError } from "@/lib/api";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LIMIT = 15;

export default function AdminPetsPage() {
  const isAdmin = getStoredUser()?.role === "Admin";
  const canEdit = getStoredUser()?.role === "Admin" || getStoredUser()?.role === "Volunteer";

  const [items, setItems] = useState<PetRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [species, setSpecies] = useState("");
  const [status, setStatus] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createSpecies, setCreateSpecies] = useState("Dog");
  const [createStatus, setCreateStatus] = useState("New");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await petsApi.list({
        page,
        limit: LIMIT,
        ...(species.trim() ? { species: species.trim() } : {}),
        ...(status.trim() ? { status: status.trim() } : {}),
      });
      setItems((res.items ?? []) as PetRow[]);
      const pg = res.pagination;
      if (pg) setTotalPages(Math.max(1, pg.totalPages));
    } catch (e) {
      toast.error("Không tải được danh sách thú", {
        description: e instanceof ApiError ? e.message : "Lỗi mạng",
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, species, status]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createPet() {
    if (!createName.trim()) {
      toast.error("Nhập tên thú");
      return;
    }
    setCreating(true);
    try {
      await petsApi.create({
        name: createName.trim(),
        species: createSpecies,
        status: createStatus,
      });
      toast.success("Đã tạo hồ sơ thú");
      setShowCreate(false);
      setCreateName("");
      void load();
    } catch (e) {
      toast.error("Tạo thất bại", { description: e instanceof ApiError ? e.message : "" });
    } finally {
      setCreating(false);
    }
  }

  async function deletePet(row: PetRow) {
    const id = row.pet_id as number | undefined;
    if (id == null || !isAdmin) return;
    if (!confirm(`Xóa thú #${id}?`)) return;
    try {
      await petsApi.delete(Number(id));
      toast.success("Đã xóa");
      void load();
    } catch (e) {
      toast.error("Xóa thất bại", { description: e instanceof ApiError ? e.message : "" });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Thú cưng</h1>
          <p className="text-slate-400 text-sm mt-1">
            Admin: bấm vào một dòng để xóa hồ sơ (có xác nhận).
          </p>
        </div>
        {canEdit && (
          <Button
            type="button"
            onClick={() => setShowCreate(true)}
            className="bg-[#2c5f51] hover:bg-[#245045] text-white font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm thú
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <Label className="text-slate-400 text-xs">Loài (species)</Label>
          <Input
            value={species}
            onChange={(e) => {
              setPage(1);
              setSpecies(e.target.value);
            }}
            placeholder="Dog / Cat …"
            className="bg-slate-900 border-slate-700 text-white w-40 mt-1"
          />
        </div>
        <div>
          <Label className="text-slate-400 text-xs">Trạng thái</Label>
          <Input
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            placeholder="New, Adopted …"
            className="bg-slate-900 border-slate-700 text-white w-40 mt-1"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-slate-600 text-slate-200"
          onClick={() => void load()}
        >
          Làm mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <>
          <AdminDataTable rows={items} onRowClick={isAdmin ? (row) => void deletePet(row) : undefined} />
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-slate-700"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-slate-700"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white">Thêm thú mới</h2>
            <div className="space-y-2">
              <Label className="text-slate-300">Tên</Label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="bg-slate-950 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-slate-300">Loài</Label>
                <Input
                  value={createSpecies}
                  onChange={(e) => setCreateSpecies(e.target.value)}
                  className="bg-slate-950 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Trạng thái</Label>
                <Input
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value)}
                  className="bg-slate-950 border-slate-600 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Huỷ
              </Button>
              <Button
                type="button"
                disabled={creating}
                className="bg-[#f6931d] text-white"
                onClick={() => void createPet()}
              >
                {creating ? "Đang lưu…" : "Tạo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
