import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/adopt", label: "Nhận nuôi" },
  { to: "/rescue", label: "Cứu hộ" },
  { to: "/blog", label: "Kiến thức" },
  { to: "/contact", label: "Liên hệ" },
];

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b py-4 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
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

        <nav className="hidden md:flex gap-8 font-bold text-sm text-gray-600 uppercase">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? "text-[#f6931d]" : "hover:text-[#f6931d]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-3">
          <Button asChild className="rounded-full bg-[#f6931d] hover:bg-orange-600 text-white font-bold px-8 shadow-lg transition-all active:scale-95">
            <Link to="/admin/login">Quản trị</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};