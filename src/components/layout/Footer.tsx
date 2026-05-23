
export const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Organization Information */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">PAWSHOPENET</h4>
            <p className="text-sm leading-relaxed opacity-80">
              A non-profit animal rescue and protection shelter. We strive for a world where every pet has a loving forever home.
            </p>
            <div className="flex gap-4 pt-2">
              {/* Social Media Icon Placeholders */}
              <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-[#ecdd14fa] transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-[#f6931d] transition-colors cursor-pointer"></div>
              <div className="w-8 h-8 bg-white/10 rounded-full hover:bg-[#f6931d] transition-colors cursor-pointer"></div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Adoption Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Volunteer List</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Transparency Reports</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rescue Stories</a></li>
            </ul>
          </div>

          {/* Column 3: Knowledge & Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Pet Care Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg">Contact</h4>
            <p className="text-sm italic">📍 Hanoi, Vietnam</p>
            <p className="text-sm font-bold text-[#f6931d]">📞 0988 015 445</p>
            <p className="text-sm">✉️ contact@pawshope.net</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-xs opacity-50">
          <p>© 2026 PAWSHOPENET. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};