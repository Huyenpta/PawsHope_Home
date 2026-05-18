import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Siren, ArrowRight } from "lucide-react";

export const RescueHero = () => (
  <section className="relative h-[520px] flex items-center justify-center text-white overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1600&auto=format&fit=crop"
      alt="Rescue mission"
      className="absolute inset-0 w-full h-full object-cover brightness-[0.45]"
    />

    <div className="relative z-10 text-center space-y-6 px-4 max-w-3xl">
      <div className="inline-flex items-center gap-2 bg-[#f6931d]/90 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
        <Siren size={16} className="animate-pulse" />
        Đường dây cứu hộ khẩn cấp
      </div>

      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
        Mỗi cuộc gọi của bạn <br />
        có thể cứu một sinh mệnh
      </h1>

      <p className="text-lg max-w-2xl mx-auto opacity-90 leading-relaxed">
        Khi bạn phát hiện một bé chó mèo gặp nạn, bị bỏ rơi hoặc đang trong tình trạng nguy hiểm,
        hãy báo ngay cho chúng tôi. Đội cứu hộ sẽ tiếp nhận và xử lý nhanh nhất có thể.
      </p>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Button
          asChild
          size="lg"
          className="bg-[#f6931d] hover:bg-orange-600 rounded-full px-8 font-bold shadow-xl text-base"
        >
          <Link to="/rescue/report">
            Báo cáo cứu hộ ngay <ArrowRight size={18} />
          </Link>
        </Button>

        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full px-8 font-bold bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-[#2c5f51]"
        >
          <a href="tel:0988015445">📞 Gọi 0988 015 445</a>
        </Button>
      </div>
    </div>
  </section>
);
