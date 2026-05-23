
import { Link } from 'react-router-dom';
import { HeartHandshake, Package, ShoppingCart } from "lucide-react";

export const Donation = () => {
  const donationMethods = [
    {
      title: "Financial Support",
      description: "Covers hospital bills, emergency surgeries, and daily shelter maintenance costs.",
      icon: <HeartHandshake size={24} />,
      path: "/donate/finance" // Đường dẫn tới trang ủng hộ tài chính
    },
    {
      title: "Supplies & Goods",
      description: "Donate food, litter, medicine, blankets, and hygiene supplies for the animals.",
      icon: <Package size={24} />,
      path: "/donate/supplies" // Đường dẫn tới trang quyên góp nhu yếu phẩm
    },
    {
      title: "Fundraising Items",
      description: "Purchase adorable PAWSHOPENET merchandise. 100% of profits go directly to rescue missions.",
      icon: <ShoppingCart size={24} />,
      path: "/shop" // Đường dẫn tới trang cửa hàng gây quỹ
    }
  ];

  return (
    <section className="py-24 bg-[#2c5f51] text-white">
      <div className="container mx-auto max-w-5xl px-4 text-center space-y-12">
        
        {/* Tiêu đề chính */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
            Your Action <span className="text-[#f6931d]">Saves Lives</span>
          </h2>
          <div className="w-24 h-1.5 bg-[#f6931d] mx-auto rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg opacity-80 font-medium">
            Every contribution, big or small, brings hope and a second chance to our furry friends.
          </p>
        </div>

        {/* Lưới các hình thức quyên góp dưới dạng Link */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {donationMethods.map((method, index) => (
            <Link 
              key={index}
              to={method.path}
              className="bg-white/10 p-8 rounded-[2rem] border border-white/5 hover:bg-white/20 transition-all duration-300 group block hover:-translate-y-2"
            >
              <div className="w-12 h-12 bg-[#f6931d] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h4 className="text-xl font-black uppercase tracking-tight mb-3">
                {method.title}
              </h4>
              <p className="text-sm leading-relaxed opacity-70">
                {method.description}
              </p>
              
              {/* Thêm chỉ dẫn nhỏ để người dùng biết là nhấn vào được */}
              <div className="mt-6 flex items-center gap-2 text-[#f6931d] font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};