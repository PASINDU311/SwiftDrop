import { useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminSidebar from "./components/AdminSidebar";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminDrivers from "./pages/AdminDrivers";


function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const isLoggedIn = !!localStorage.getItem("adminToken");

  if (!isLoggedIn) {
    return <AdminLogin />;
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
          window.location.reload();
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