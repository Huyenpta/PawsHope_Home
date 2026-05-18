import { Link } from "react-router-dom";
import { RescueHero } from "@/components/rescue/RescueHero";
import { EmergencyHotline } from "@/components/rescue/EmergencyHotline";
import { RescueProcess } from "@/components/rescue/RescueProcess";
import { RescueStatsCounter } from "@/components/rescue/RescueStatsCounter";
import { RescueStories } from "@/components/home/RescueStories";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default function RescuePage() {
  return (
    <>
      <RescueHero />
      <EmergencyHotline />
      <RescueStatsCounter />
      <RescueProcess />

      {/* Section quan trọng: Khi nào cần báo cứu hộ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-[#2c5f51] uppercase tracking-tight">
              Khi nào nên gọi cứu hộ?
            </h2>
            <div className="w-16 h-1 bg-[#f6931d] mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Phát hiện chó mèo bị thương, gãy xương, chảy máu trên đường",
              "Bé bị bỏ rơi: trong thùng giấy, gầm cầu, bãi rác...",
              "Đàn chó mèo con sơ sinh không có mẹ",
              "Động vật bị mắc kẹt: trên cây, dưới cống, trong nhà hoang",
              "Bé bị bạo hành, xích nhốt trong điều kiện tồi tệ",
              "Phát hiện ổ bệnh, dịch ảnh hưởng đến đàn",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-[#fdfaf5] rounded-xl p-4 border border-orange-100"
              >
                <AlertTriangle
                  size={20}
                  className="text-[#f6931d] shrink-0 mt-0.5"
                />
                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RescueStories />

      {/* CTA cuối trang */}
      <section className="py-16 bg-gradient-to-br from-[#2c5f51] to-[#1f4339]">
        <div className="container mx-auto max-w-4xl px-4 text-center text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Đừng làm ngơ! Một hành động nhỏ - Một cuộc đời mới
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Báo cáo cứu hộ chỉ mất 1 phút. Đội ngũ của chúng tôi sẵn sàng 24/7.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#f6931d] hover:bg-orange-600 rounded-full px-10 font-bold text-base shadow-2xl"
          >
            <Link to="/rescue/report">
              Báo cáo cứu hộ ngay <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
