export const AboutSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-[#2c5f51]">Sứ mệnh & Tầm nhìn</h2>
          <p className="text-gray-600 leading-relaxed">Được hình thành từ tình yêu thương vô điều kiện, chúng tôi tập trung vào 3 trụ cột: Cứu hộ khẩn cấp - Chăm sóc y tế - Tìm mái ấm trọn đời.</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="border-l-4 border-[#f6931d] pl-4">
              <span className="block text-4xl font-bold text-[#2c5f51]">1,500+</span>
              <span className="text-gray-500 text-sm italic">Ca cứu hộ thành công</span>
            </div>
            <div className="border-l-4 border-[#f6931d] pl-4">
              <span className="block text-4xl font-bold text-[#2c5f51]">850+</span>
              <span className="text-gray-500 text-sm italic">Bé đã được nhận nuôi</span>
            </div>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b" className="rounded-3xl shadow-2xl" />
      </div>
    </div>
  </section>
);