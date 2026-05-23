import { Link } from "react-router-dom"; // Added for routing
import { Button } from "@/components/ui/button";
import { PawPrint, Bell, ShoppingCart } from "lucide-react";

export const Navbar = () => {
  // Simulated notification and cart counts
  const notificationCount = 3; 
  const cartCount = 2;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-[#2c5f51] rounded-full flex items-center justify-center shadow-md transition-all group-hover:rotate-12 group-hover:scale-110">
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
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 font-bold text-sm text-gray-600 uppercase">
          <Link to="/" className="hover:text-[#f6931d] transition-colors text-[#2c5f51]">Home</Link>
          <Link to="/adopt" className="hover:text-[#f6931d] transition-colors">Adopt</Link>
          <Link to="/rescue" className="hover:text-[#f6931d] transition-colors">Rescue</Link>
          <Link to="/shop" className="hover:text-[#f6931d] transition-colors">Shop</Link>
          <Link to="/contact" className="hover:text-[#f6931d] transition-colors">Contact</Link>
        </nav>

        {/* Action Icons & Buttons */}
        <div className="flex items-center gap-5">
          {/* Rescue Notification Icon */}
          <div className="relative cursor-pointer group">
            <Bell size={24} className="text-[#2c5f51] group-hover:text-[#f6931d] transition-colors" />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Shopping Cart Icon */}
          <div className="relative cursor-pointer group">
            <ShoppingCart 
              size={24} 
              className="text-[#2c5f51] group-hover:text-[#f6931d] transition-colors" 
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#f6931d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>

          <div className="h-6 w-[1px] bg-gray-200 ml-2 hidden sm:block"></div>

          <Button 
            className="rounded-full bg-[#f6931d] hover:bg-orange-600 text-white font-bold px-8 shadow-lg transition-all active:scale-95"
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};