import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { PublicLayout } from "@/layouts/PublicLayout";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { RequireRole } from "@/components/admin/RequireRole";
import { AdminLayout } from "@/components/admin/AdminLayout";
import HomePage from "./pages/HomePage";
import RescuePage from "./pages/RescuePage";
import RescueReportPage from "./pages/RescueReportPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRescuePage from "./pages/admin/AdminRescuePage";
import AdminPetsPage from "./pages/admin/AdminPetsPage";
import AdminKennelsPage from "./pages/admin/AdminKennelsPage";
import AdminAdoptionsPage from "./pages/admin/AdminAdoptionsPage";
import AdminDonationsPage from "./pages/admin/AdminDonationsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import AdminExpensesPage from "./pages/admin/AdminExpensesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminVolunteerApplicationsPage from "./pages/admin/AdminVolunteerApplicationsPage";
import AdminNotificationsPage from "./pages/admin/AdminNotificationsPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rescue" element={<RescuePage />} />
          <Route path="/rescue/report" element={<RescueReportPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="rescue" element={<AdminRescuePage />} />
            <Route path="pets" element={<AdminPetsPage />} />
            <Route path="kennels" element={<AdminKennelsPage />} />
            <Route path="adoptions" element={<AdminAdoptionsPage />} />
            <Route path="donations" element={<AdminDonationsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />

            <Route element={<RequireRole roles={["Admin"]} />}>
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="expenses" element={<AdminExpensesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="volunteers" element={<AdminVolunteerApplicationsPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
