import { PhoneCall, ClipboardCheck, Ambulance, Heart } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "1. Tiếp nhận",
    desc: "Bạn gửi báo cáo qua form hoặc gọi hotline. Chúng tôi xác nhận trong vòng 15 phút.",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: ClipboardCheck,
    title: "2. Đánh giá",
    desc: "Đội ngũ đánh giá mức độ khẩn cấp, lên kế hoạch và phân công tình nguyện viên phù hợp.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Ambulance,
    title: "3. Cứu hộ",
    desc: "TNV xuống hiện trường, thực hiện cứu hộ và sơ cứu ban đầu nếu cần thiết.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: Heart,
    title: "4. Chăm sóc",
    desc: "Bé được đưa về trạm, kiểm tra y tế, điều trị và chờ đến ngày tìm được mái ấm mới.",
    color: "bg-green-100 text-green-700",
  },
];

export const RescueProcess = () => (
  <section className="py-20 bg-[#fdfaf5]">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="text-center mb-14 space-y-3">
        <h2 className="text-3xl md:text-4xl font-black text-[#2c5f51] uppercase tracking-tight">
          Quy trình cứu hộ
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          4 bước minh bạch, nhanh chóng và chuyên nghiệp để cứu giúp từng sinh mệnh nhỏ.
        </p>
        <div className="w-16 h-1 bg-[#f6931d] mx-auto mt-2 rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className={`w-14 h-14 rounded-full ${s.color} flex items-center justify-center mb-4`}>
                <Icon size={26} />
              </div>
              <h3 className="font-black text-[#2c5f51] text-lg mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
