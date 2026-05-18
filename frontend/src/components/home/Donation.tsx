export const Donation = () => (
  <section className="py-20 bg-[#2c5f51] text-white">
    <div className="container mx-auto max-w-4xl px-4 text-center space-y-8">
      <h2 className="text-4xl font-bold">Hành động của bạn cứu sống các em</h2>
      <div className="grid md:grid-cols-3 gap-8 text-left">
        <div className="bg-white/10 p-6 rounded-2xl">
          <h4 className="font-bold mb-2">Tài chính</h4>
          <p className="text-sm opacity-80">Chi trả viện phí, phẫu thuật khẩn cấp và duy trì trạm.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl">
          <h4 className="font-bold mb-2">Nhu yếu phẩm - Vật dụng</h4>
          <p className="text-sm opacity-80">Quyên góp thức ăn, cát vệ sinh, thuốc men, bỉm,...</p>
        </div>
        <div className="bg-white/10 p-6 rounded-2xl">
          <h4 className="font-bold mb-2">Sản phẩm gây quỹ</h4>
          <p className="text-sm opacity-80">Đồ xinh gây quỹ từ PAWSHOPENET</p>
        </div>
      </div>
    </div>
  </section>
);