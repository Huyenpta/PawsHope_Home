import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { notificationsApi } from "@/api/notifications";
import { ApiError } from "@/lib/api";
import { formatCell } from "@/lib/adminFormat";
import { Button } from "@/components/ui/button";

export default function AdminNotificationsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [l, u] = await Promise.all([notificationsApi.list(), notificationsApi.unreadCount()]);
      setRows((l.data ?? []) as Record<string, unknown>[]);
      setUnread(u.data?.count ?? 0);
    } catch (e) {
      toast.error("Không tải thông báo", { description: e instanceof ApiError ? e.message : "" });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function readOne(id: number) {
    try {
      await notificationsApi.markRead(id);
      void load();
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    }
  }

  async function readAll() {
    try {
      await notificationsApi.markAllRead();
      toast.success("Đã đánh dấu đã đọc");
      void load();
    } catch (e) {
      toast.error("Lỗi", { description: e instanceof ApiError ? e.message : "" });
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Thông báo</h1>
          <p className="text-slate-400 text-sm mt-1">
            Thông báo của tài khoản bạn — chưa đọc:{" "}
            <span className="text-[#f6931d] font-bold">{unread ?? "—"}</span>
          </p>
        </div>
        <Button type="button" variant="outline" className="border-slate-600 text-slate-200" onClick={() => void readAll()}>
          Đọc tất cả
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#f6931d]" />
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => {
            const id = r.noti_id as number | undefined;
            const read = r.is_read === true || r.is_read === 1 || r.is_read === "1";
            return (
              <li
                key={String(id ?? i)}
                className={`rounded-xl border p-4 text-sm ${
                  read ? "border-slate-800 bg-slate-900/40 text-slate-400" : "border-[#f6931d]/30 bg-slate-900/80 text-slate-100"
                }`}
              >
                <div className="flex justify-between gap-3">
                  <pre className="whitespace-pre-wrap font-sans text-xs overflow-x-auto">{formatCell(r)}</pre>
                  {id != null && !read && (
                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0 bg-[#2c5f51] text-white"
                      onClick={() => void readOne(Number(id))}
                    >
                      Đã đọc
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
