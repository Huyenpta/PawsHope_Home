import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, auth } from "@/lib/api";
import { authApi, canAccessAdmin, getStoredUser } from "@/api/auth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = auth.getToken();
  const stored = getStoredUser();
  if (token && stored && canAccessAdmin(stored.role)) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(username.trim(), password);
      const payload = res.data;
      if (!payload?.token || !payload.user) {
        toast.error("Đăng nhập thất bại", { description: "Phản hồi không hợp lệ từ máy chủ." });
        return;
      }
      if (!canAccessAdmin(payload.user.role)) {
        toast.error("Không có quyền", {
          description: "Chỉ tài khoản Admin hoặc Tình nguyện viên được vào khu vực này.",
        });
        return;
      }
      authApi.persistSession(payload);
      toast.success(`Chào ${payload.user.fullName}`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không kết nối được máy chủ. Kiểm tra API đang chạy.";
      toast.error("Đăng nhập thất bại", { description: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1a2f29] to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2c5f51] shadow-xl mx-auto mb-2">
            <PawPrint className="w-8 h-8 text-[#f6931d] fill-[#f6931d]" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">PawsHope Admin</h1>
          <p className="text-slate-400 text-sm">Đăng nhập để quản lý ca cứu hộ và thống kê.</p>
        </div>

        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-user" className="text-slate-300">
                Tên đăng nhập
              </Label>
              <Input
                id="admin-user"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pass" className="text-slate-300">
                Mật khẩu
              </Label>
              <Input
                id="admin-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#f6931d] hover:bg-orange-600 text-white font-bold shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Đang đăng nhập…
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          <Link to="/" className="text-[#f6931d] hover:underline font-medium">
            ← Quay về website công khai
          </Link>
        </p>
      </div>
    </div>
  );
}
