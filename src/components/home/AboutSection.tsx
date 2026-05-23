export const AboutSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Nội dung văn bản */}
        <div className="space-y-6">
          <div className="inline-block px-4 py-1 bg-[#f6931d]/10 rounded-full">
            <span className="text-[#f6931d] text-xs font-bold uppercase tracking-widest">About Us</span>
          </div>
          
          <h2 className="text-4xl font-black text-[#2c5f51] uppercase tracking-tighter leading-tight">
            Our Mission & <span className="text-[#f6931d]">Vision</span>
          </h2>
          
          <p className="text-gray-600 leading-relaxed text-lg">
            Driven by unconditional love, we focus on three core pillars: 
            <span className="font-bold text-[#2c5f51]"> Emergency Rescue</span>, 
            <span className="font-bold text-[#2c5f51]"> Medical Care</span>, and 
            <span className="font-bold text-[#2c5f51]"> Forever Home Placement</span>.
          </p>

          {/* Chỉ số thống kê */}
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="border-l-4 border-[#f6931d] pl-5 space-y-1">
              <span className="block text-5xl font-black text-[#2c5f51] tracking-tighter">1,500+</span>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wide">Successful Rescues</span>
            </div>
            <div className="border-l-4 border-[#f6931d] pl-5 space-y-1">
              <span className="block text-5xl font-black text-[#2c5f51] tracking-tighter">850+</span>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wide">Happy Adoptions</span>
            </div>
          </div>

          <div className="pt-6">
            <p className="text-gray-500 italic text-sm">
              "Every paw print tells a story of survival and hope."
            </p>
          </div>
        </div>

        {/* Hình ảnh minh họa */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#f6931d]/10 rounded-[2.5rem] transform rotate-3 transition-transform group-hover:rotate-0 duration-500"></div>
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b" 
            alt="Rescue pets playing"
            className="relative rounded-[2rem] shadow-2xl z-10 w-full h-[450px] object-cover" 
          />
          {/* Badge nhỏ trang trí đè lên ảnh */}
          <div className="absolute -bottom-6 -left-6 bg-[#2c5f51] text-white p-6 rounded-2xl z-20 shadow-xl hidden lg:block">
            <p className="text-2xl font-black italic">Since 2020</p>
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Saving lives daily</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);