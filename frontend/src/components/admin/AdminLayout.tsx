import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const st = location.state as { forbidden?: boolean } | undefined;
    if (st?.forbidden) {
      toast.error("Bạn không có quyền truy cập trang đó.");
    }
  }, [location.state, location.key]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-label="Đóng menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <AdminSidebar mobileOpen={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
          <button
            type="button"
            className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
            aria-expanded={mobileNavOpen}
            aria-label="Mở menu"
            onClick={() => setMobileNavOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-[#f6931d] tracking-tight">PawsHope Admin</span>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
