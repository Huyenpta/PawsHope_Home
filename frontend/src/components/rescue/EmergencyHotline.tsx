import { Phone, MessageCircle, Clock } from "lucide-react";

export const EmergencyHotline = () => (
  <section className="py-12 bg-[#2c5f51]">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid md:grid-cols-3 gap-4 text-white">
        <a
          href="tel:0988015445"
          className="flex items-center gap-4 bg-white/10 hover:bg-white/15 rounded-2xl p-5 transition-all group"
        >
          <div className="w-14 h-14 bg-[#f6931d] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Phone size={26} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">Hotline khẩn cấp</p>
            <p className="text-2xl font-black">0988 015 445</p>
          </div>
        </a>

        <a
          href="https://m.me/pawshope.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white/10 hover:bg-white/15 rounded-2xl p-5 transition-all group"
        >
          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <MessageCircle size={26} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">Nhắn tin nhanh</p>
            <p className="text-xl font-bold">Messenger / Zalo</p>
          </div>
        </a>

        <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-5">
          <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center shrink-0">
            <Clock size={26} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider opacity-70">Hoạt động</p>
            <p className="text-xl font-bold">24 / 7 mỗi ngày</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
