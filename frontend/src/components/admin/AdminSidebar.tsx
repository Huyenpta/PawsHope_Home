import {
  LayoutDashboard,
  LifeBuoy,
  Dog,
  Warehouse,
  HeartHandshake,
  Wallet,
  ShoppingBag,
  Receipt,
  Users,
  UserPlus,
  Bell,
  PawPrint,
  LogOut,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "@/api/auth";
import { cn } from "@/lib/utils";

type StaffRole = "Admin" | "Volunteer";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  /** Nếu khai báo: chỉ các role này thấy (Admin / Volunteer) */
  onlyRoles?: StaffRole[];
};

const allLinks: NavItem[] = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/admin/rescue", label: "Ca cứu hộ", icon: LifeBuoy },
  { to: "/admin/pets", label: "Thú cưng", icon: Dog },
  { to: "/admin/kennels", label: "Chuồng trại", icon: Warehouse },
  { to: "/admin/adoptions", label: "Nhận nuôi", icon: HeartHandshake },
  { to: "/admin/donations", label: "Quyên góp", icon: Wallet },
  { to: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag, onlyRoles: ["Admin"] },
  { to: "/admin/expenses", label: "Chi phí", icon: Receipt, onlyRoles: ["Admin"] },
  { to: "/admin/users", label: "Người dùng", icon: Users, onlyRoles: ["Admin"] },
  { to: "/admin/volunteers", label: "Đơn TNV", icon: UserPlus, onlyRoles: ["Admin"] },
  { to: "/admin/notifications", label: "Thông báo", icon: Bell },
];

function linksForRole(role: string | undefined): NavItem[] {
  if (!role) return allLinks.filter((l) => !l.onlyRoles);
  const r = role === "Admin" || role === "Volunteer" ? role : null;
  if (!r) return allLinks.filter((l) => !l.onlyRoles);
  return allLinks.filter((l) => !l.onlyRoles || l.onlyRoles.includes(r));
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function AdminSidebar({ mobileOpen, onNavigate }: AdminSidebarProps) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const links = linksForRole(user?.role);

  function logout() {
    clearSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <aside
      className={cn(
        "fixed md:sticky top-0 z-50 h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-900 flex flex-col transition-transform duration-200 md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2c5f51] flex items-center justify-center shadow-lg">
          <PawPrint className="w-6 h-6 text-[#f6931d] fill-[#f6931d]" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm text-white tracking-tight truncate">PAWSHOPE</p>
          <p className="text-[10px] uppercase tracking-widest text-[#f6931d] font-bold">Admin</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2c5f51] text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/80",
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0 opacity-90" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-2">
        {user && (
          <div className="px-3 py-2 rounded-lg bg-slate-800/50 text-xs">
            <p className="font-semibold text-slate-100 truncate">{user.fullName}</p>
            <p className="text-slate-500 truncate">{user.role}</p>
          </div>
        )}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          onClick={onNavigate}
        >
          <ExternalLink className="w-4 h-4" />
          Về trang chủ
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
