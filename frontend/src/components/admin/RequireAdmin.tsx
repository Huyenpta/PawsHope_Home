import { Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "@/lib/api";

/** Yêu cầu JWT — kiểm tra quyền role sau khi đăng nhập */
export function RequireAdmin() {
  const location = useLocation();
  if (!auth.getToken()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
