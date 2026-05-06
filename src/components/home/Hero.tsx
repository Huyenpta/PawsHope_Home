import { Button } from "@/components/ui/button";

export const Hero = () => (
  <section className="relative h-[600px] flex items-center justify-center text-white">
    <img src="https://images.unsplash.com/photo-1450778869180-41d0601e046e" className="absolute inset-0 w-full h-full object-cover brightness-50" />
    <div className="relative z-10 text-center space-y-6 px-4">
      <h1 className="text-5xl md:text-5xl font-bold uppercase tracking-tighter">Cùng chung tay, để không bé nào bị bỏ lại</h1>
      <p className="text-xl max-w-2xl mx-auto opacity-90">Hơn 900 em chó mèo đang được chăm sóc. Sứ mệnh của chúng tôi là tìm lại mái ấm cho những tâm hồn nhỏ bé.</p>
      
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {/* Nút Nhận nuôi ngay */}
        <Button size="lg" className="bg-[#f6931d] hover:bg-orange-600 rounded-full px-8 font-bold">
          Nhận nuôi ngay
        </Button>

        {/* NÚT ỦNG HỘ: Đã thêm nền màu tím và chữ trắng nổi bật */}
        <Button 
          size="lg" 
          className="bg-[#6f4fba] hover:bg-[#5b3da1] text-white border-none rounded-full px-8 font-bold shadow-lg transition-all"
        >
          Ủng hộ
        </Button>

        {/* Nút Đăng ký tình nguyện */}
        <Button size="lg" variant="secondary" className="rounded-full px-8 font-bold">
          Đăng ký tình nguyện
        </Button>
      </div>
    </div>
  </section>
);