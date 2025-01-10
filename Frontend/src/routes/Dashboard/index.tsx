import DashboardPage from "@/pages/dashboard";
import DashboardLayout from "@/pages/dashboard/Layout";
import SettingsPage from "@/pages/dashboard/settings";
import ProfilePage from "@/pages/dashboard/profile";
import { Route, Routes } from "react-router-dom";
import AnalyticsPage from "@/pages/dashboard/analytics";
import { ProtectedRoute } from "@/components/protected-route";

const DashboardRoutes = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/" index element={<DashboardPage/>} />
          <Route path='/settings' element={<SettingsPage/>} />
          <Route path="/profile" element={<ProfilePage />} /> 
          <Route path="/analytics" element={<AnalyticsPage />} /> 
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardRoutes;