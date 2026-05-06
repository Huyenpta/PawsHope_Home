import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react"; // Biểu tượng bàn chân chó mèo chuẩn

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
        
        {/* Logo với biểu tượng bàn chân thú cưng */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-[#2c5f51] rounded-full flex items-center justify-center shadow-md transition-all group-hover:rotate-12 group-hover:scale-110">
            {/* Icon bàn chân màu cam, có đổ màu đặc (fill) để nhìn rõ nét */}
            <PawPrint size={26} className="text-[#f6931d] fill-[#f6931d]" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-black text-[#2c5f51] tracking-tighter">
              PAWSHOPENET
            </span>
            <span className="text-[10px] font-bold text-[#f6931d] uppercase tracking-[0.2em] pl-1">
              Rescue & Adopt
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 font-bold text-sm text-gray-600 uppercase">
          <a href="/" className="hover:text-[#f6931d] transition-colors">Trang chủ</a>
          <a href="/adopt" className="hover:text-[#f6931d] transition-colors">Nhận nuôi</a>
          <a href="/rescue" className="hover:text-[#f6931d] transition-colors">Cứu hộ</a>
          <a href="/blog" className="hover:text-[#f6931d] transition-colors">Kiến thức</a>
          <a href="/contact" className="hover:text-[#f6931d] transition-colors">Liên hệ</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            className="rounded-full bg-[#f6931d] hover:bg-orange-600 text-white font-bold px-8 shadow-lg transition-all active:scale-95"
          >
            Đăng nhập
          </Button>
        </div>
      </div>
    </header>
  );
};