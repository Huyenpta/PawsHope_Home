import { Link } from "react-router-dom";
import { RescueReportForm } from "@/components/rescue/RescueReportForm";
import { ChevronRight, Home, Phone, ShieldCheck, Clock } from "lucide-react";

export default function RescueReportPage() {
  return (
    <>
      {/* Breadcrumb + Header */}
      <section className="bg-gradient-to-br from-[#2c5f51] to-[#1f4339] text-white py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <nav className="flex items-center gap-2 text-sm opacity-80 mb-4">
            <Link to="/" className="flex items-center gap-1 hover:text-[#f6931d] transition-colors">
              <Home size={14} /> Trang chủ
            </Link>
            <ChevronRight size={14} />
            <Link to="/rescue" className="hover:text-[#f6931d] transition-colors">
              Cứu hộ
            </Link>
            <ChevronRight size={14} />
            <span>Báo cáo</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
            Báo cáo ca cứu hộ
          </h1>
          <p className="opacity-90 mt-2 max-w-2xl">
            Hãy điền thông tin càng chi tiết càng tốt. Đội cứu hộ sẽ phản hồi trong vòng 15 phút sau khi tiếp nhận.
          </p>
        </div>
      </section>

      {/* Main content - Form + Sidebar info */}
      <section className="py-12 md:py-16 bg-[#fdfaf5]">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-[#2c5f51] mb-6">
                  Thông tin báo cáo
                </h2>
                <RescueReportForm />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4">
              <div className="bg-[#2c5f51] text-white rounded-2xl p-6 space-y-3">
                <div className="w-12 h-12 bg-[#f6931d] rounded-full flex items-center justify-center">
                  <Phone size={22} />
                </div>
                <h3 className="font-black text-lg">Trường hợp khẩn cấp?</h3>
                <p className="text-sm opacity-90">
                  Nếu tình huống đe doạ tính mạng (đang chảy máu nặng, bị tai nạn ngay trước mắt), hãy gọi
                  trực tiếp:
                </p>
                <a
                  href="tel:0988015445"
                  className="block bg-white text-[#2c5f51] font-black text-xl text-center rounded-xl py-3 hover:bg-[#f6931d] hover:text-white transition-colors"
                >
                  📞 0988 015 445
                </a>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-[#2c5f51]">
                  <Clock size={20} />
                  <h3 className="font-bold">Thời gian xử lý</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-[#f6931d]">•</span>
                    <span>Xác nhận tiếp nhận: trong 15 phút</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f6931d]">•</span>
                    <span>Có mặt hiện trường: 30-90 phút (TP.HCM)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f6931d]">•</span>
                    <span>Cập nhật trạng thái liên tục đến hoàn tất</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-[#2c5f51]">
                  <ShieldCheck size={20} />
                  <h3 className="font-bold">Cam kết của chúng tôi</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex gap-2">
                    <span className="text-[#f6931d]">•</span>
                    <span>Bảo mật thông tin cá nhân tuyệt đối</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f6931d]">•</span>
                    <span>Minh bạch chi phí và quá trình xử lý</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#f6931d]">•</span>
                    <span>Không tính phí cho người báo cáo</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
