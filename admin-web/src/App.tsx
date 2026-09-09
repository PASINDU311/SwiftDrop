import { useState } from "react";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminDrivers from "./pages/AdminDrivers";
import AdminDriverApplications from "./pages/AdminDriverApplications";

import AdminSidebar from "./components/AdminSidebar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  if (!isLoggedIn) {
    return (
      <AdminLogin
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  const handleToggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "theme",
      newMode ? "dark" : "light"
    );
  };

  return (
    <div
      className={
        darkMode
          ? "dark flex min-h-screen"
          : "flex min-h-screen"
      }
    >
      <AdminSidebar
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        onDashboard={() =>
          setCurrentPage("dashboard")
        }
        onUsers={() =>
          setCurrentPage("users")
        }
        onDeliveries={() =>
          setCurrentPage("deliveries")
        }
        onDrivers={() =>
          setCurrentPage("drivers")
        }
        onDriverApplications={() =>
          setCurrentPage("driver-applications")
        }
        onLogout={() => {
          localStorage.removeItem(
            "adminToken"
          );

          setIsLoggedIn(false);
        }}
      />

      <main className="min-w-0 flex-1">
        {currentPage === "dashboard" && (
          <AdminDashboard />
        )}

        {currentPage === "users" && (
          <AdminUsers />
        )}

        {currentPage === "deliveries" && (
          <AdminDeliveries />
        )}

        {currentPage === "drivers" && (
          <AdminDrivers />
        )}

        {currentPage === "driver-applications" && (
          <AdminDriverApplications />
        )}
      </main>
    </div>
  );
}

export default App;