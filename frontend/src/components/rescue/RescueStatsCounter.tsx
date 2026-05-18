import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Clock, FileText } from "lucide-react";
import { rescueApi, type RescueStats } from "@/api/rescue";

const FALLBACK_STATS: RescueStats = {
  total: 0,
  Rescued: 0,
  "In Progress": 0,
  Pending: 0,
  Failed: 0,
};

export const RescueStatsCounter = () => {
  const [stats, setStats] = useState<RescueStats>(FALLBACK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    rescueApi
      .publicStats()
      .then((res) => {
        if (!cancelled && res.data) setStats(res.data);
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    {
      icon: FileText,
      label: "Tổng số ca tiếp nhận",
      value: stats.total,
      color: "text-[#2c5f51] bg-[#2c5f51]/10",
    },
    {
      icon: CheckCircle2,
      label: "Đã cứu hộ thành công",
      value: stats.Rescued,
      color: "text-green-700 bg-green-100",
    },
    {
      icon: Loader2,
      label: "Đang xử lý",
      value: stats["In Progress"],
      color: "text-blue-700 bg-blue-100",
    },
    {
      icon: Clock,
      label: "Chờ tiếp nhận",
      value: stats.Pending,
      color: "text-orange-700 bg-orange-100",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-black text-[#2c5f51] uppercase tracking-tight">
            Hành trình cứu hộ trong tháng
          </h2>
          <p className="text-gray-500 italic">Mỗi con số là một câu chuyện được viết tiếp 🐾</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-[#fdfaf5] rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon size={22} />
                </div>
                <p className="text-3xl md:text-4xl font-black text-[#2c5f51]">
                  {loading ? "…" : item.value}
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1 leading-tight">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
