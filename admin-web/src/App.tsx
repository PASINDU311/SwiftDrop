import { useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminDrivers from "./pages/AdminDrivers";
import AdminSidebar from "./components/AdminSidebar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  const [currentPage, setCurrentPage] = useState("dashboard");

  if (!isLoggedIn) {
    return (
      <AdminLogin
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar
        onDashboard={() => setCurrentPage("dashboard")}
        onUsers={() => setCurrentPage("users")}
        onDeliveries={() => setCurrentPage("deliveries")}
        onDrivers={() => setCurrentPage("drivers")}
        onLogout={() => {
          localStorage.removeItem("adminToken");
          setIsLoggedIn(false);
        }}
      />

      <main style={{ flex: 1 }}>
        {currentPage === "dashboard" && <AdminDashboard />}

        {currentPage === "users" && <AdminUsers />}

        {currentPage === "deliveries" && <AdminDeliveries />}

        {currentPage === "drivers" && <AdminDrivers />}
      </main>
    </div>
  );
}

export default App;