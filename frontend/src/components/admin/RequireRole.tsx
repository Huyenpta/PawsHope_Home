import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStoredUser } from "@/api/auth";

type RoleName = "Admin" | "Volunteer" | "User";

/** Chặn route con nếu role không nằm trong danh sách (chỉ Admin hoặc Admin|TNV tuỳ route). */
export function RequireRole({ roles }: { roles: RoleName[] }) {
  const location = useLocation();
  const user = getStoredUser();
  if (!user || !roles.includes(user.role as RoleName)) {
    return <Navigate to="/admin" replace state={{ from: location, forbidden: true }} />;
  }
  return <Outlet />;
}
