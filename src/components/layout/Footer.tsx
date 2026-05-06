export const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Cột 1: Thông tin tổ chức */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">PAWSHOPENET</h4>
            <p className="text-sm leading-relaxed opacity-80">
              Trạm cứu hộ và bảo vệ động vật phi lợi nhuận. Chúng tôi nỗ lực vì một thế giới nơi mọi bé cún miu đều có mái ấm.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Giả lập các icon MXH */}
              <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-[#ecdd14fa] transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-[#f6931d] transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-[#f6931d] transition-colors cursor-pointer"></div>
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Quy trình nhận nuôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Danh sách tình nguyện viên</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Báo cáo minh bạch</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu chuyện cứu hộ</a></li>
            </ul>
          </div>

          {/* Cột 3: Kiến thức & Pháp lý */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Thông tin</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Chăm sóc chó mèo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ trực tiếp */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Liên hệ</h4>
            <p className="text-sm italic">📍 Hà Nội, Việt Nam</p>
            <p className="text-sm font-bold text-[#f6931d]">📞 0988 015 445</p>
            <p className="text-sm">✉️ contact@pawshope.net</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-xs opacity-50">
          <p>© 2026 PawsHope - Sân Nhà Nhiều Chó. Bản quyền thuộc về tổ chức.</p>
        </div>
      </div>
    </footer>
  );
};