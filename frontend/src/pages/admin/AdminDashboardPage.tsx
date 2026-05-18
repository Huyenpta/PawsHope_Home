import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  LifeBuoy,
  Bell,
  Wallet,
} from "lucide-react";

import { rescueApi, type RescueStats } from "@/api/rescue";
import { donationsApi } from "@/api/donations";
import { notificationsApi } from "@/api/notifications";
import { ApiError } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function num(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<RescueStats | null>(null);
  const [donationStats, setDonationStats] = useState<{ count?: unknown; total?: unknown } | null>(null);
  const [unreadNoti, setUnreadNoti] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    Promise.all([rescueApi.stats(), donationsApi.stats(), notificationsApi.unreadCount()])
      .then(([rRes, dRes, nRes]) => {
        if (cancelled) return;
        if (rRes.data) setStats(rRes.data);
        if (dRes.data) setDonationStats(dRes.data);
        if (nRes.data) setUnreadNoti(Number(nRes.data.count ?? 0));
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : "Không tải được một số thống kê.";
          setError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const s = stats ?? {
    Pending: 0,
    "In Progress": 0,
    Rescued: 0,
    Failed: 0,
    total: 0,
  };

  const cards = [
    {
      label: "Tổng ca",
      value: num(s.total),
      icon: FileText,
      tint: "text-sky-400 bg-sky-400/10",
    },
    {
      label: "Chờ tiếp nhận",
      value: num(s.Pending),
      icon: Clock,
      tint: "text-amber-400 bg-amber-400/10",
    },
    {
      label: "Đang xử lý",
      value: num(s["In Progress"]),
      icon: CircleDot,
      tint: "text-blue-400 bg-blue-400/10",
    },
    {
      label: "Đã cứu hộ",
      value: num(s.Rescued),
      icon: CheckCircle2,
      tint: "text-emerald-400 bg-emerald-400/10",
    },
    {
      label: "Không thành công",
      value: num(s.Failed),
      icon: AlertCircle,
      tint: "text-red-400 bg-red-400/10",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Tổng quan</h1>
        <p className="text-slate-400 mt-1 text-sm md:text-base">
          Thống kê báo cáo cứu hộ trong hệ thống — dữ liệu theo server.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-200 flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#f6931d] animate-spin opacity-80" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Card
                key={c.label}
                className="bg-slate-900/90 border-slate-800 ring-slate-800 text-slate-100"
              >
                <CardHeader className="pb-2">
                  <div className={`inline-flex p-2 rounded-lg w-fit ${c.tint}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <CardDescription className="text-slate-500">{c.label}</CardDescription>
                  <CardTitle className="text-3xl font-black tabular-nums text-white">
                    {c.value}
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
          <Card className="bg-slate-900/90 border-slate-800">
            <CardHeader className="pb-2">
              <div className="inline-flex p-2 rounded-lg w-fit text-emerald-400 bg-emerald-400/10">
                <Wallet className="w-5 h-5" />
              </div>
              <CardDescription className="text-slate-500">Quyên góp tiền (tổng đã ghi)</CardDescription>
              <CardTitle className="text-2xl font-black text-white tabular-nums">
                {num(donationStats?.total)} <span className="text-sm font-normal text-slate-500">/ {num(donationStats?.count)} giao dịch</span>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900/90 border-slate-800">
            <CardHeader className="pb-2">
              <div className="inline-flex p-2 rounded-lg w-fit text-amber-400 bg-amber-400/10">
                <Bell className="w-5 h-5" />
              </div>
              <CardDescription className="text-slate-500">Thông báo chưa đọc</CardDescription>
              <CardTitle className="text-2xl font-black text-white tabular-nums">
                {unreadNoti ?? "—"}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <Card className="bg-slate-900/90 border-slate-800 ring-slate-800 overflow-hidden">
        <CardHeader className="border-b border-slate-800 bg-[#2c5f51]/20">
          <CardTitle className="text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-[#f6931d]" />
            Khu vực vận hành
          </CardTitle>
          <CardDescription className="text-slate-400">
            Đi nhanh tới các màn quản lý — xem thêm trong menu bên trái.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/rescue"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f6931d] hover:bg-orange-600 text-white font-bold text-sm shadow-lg"
          >
            Ca cứu hộ
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin/pets"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-600"
          >
            Thú cưng
          </Link>
          <Link
            to="/admin/adoptions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-600"
          >
            Nhận nuôi
          </Link>
          <Link
            to="/admin/donations"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-600"
          >
            Quyên góp
          </Link>
          <Link
            to="/admin/notifications"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-600"
          >
            Thông báo
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
