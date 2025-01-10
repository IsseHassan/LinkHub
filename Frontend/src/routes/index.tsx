import HomePage from "@/pages/landing";
import DashboardRoutes from "./Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import Profile from "@/pages/user";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;