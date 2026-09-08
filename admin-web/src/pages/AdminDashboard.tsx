import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_drivers: 0,
    total_customers: 0,
    total_deliveries: 0,
    pending_deliveries: 0,
    active_deliveries: 0,
    completed_deliveries: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://192.168.1.37:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Admin dashboard data:", data);

        if (response.ok && data.statistics) {
          setStats(data.statistics);
        }
      } catch (error) {
        console.error("Dashboard stats error:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h1>SwiftDrop Admin Dashboard</h1>

      <h2>Statistics</h2>

      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={stats.total_users}
        />

        <StatCard
          title="Total Drivers"
          value={stats.total_drivers}
        />

        <StatCard
          title="Total Customers"
          value={stats.total_customers}
        />

        <StatCard
          title="Total Deliveries"
          value={stats.total_deliveries}
        />

        <StatCard
          title="Pending Deliveries"
          value={stats.pending_deliveries}
        />

        <StatCard
          title="Active Deliveries"
          value={stats.active_deliveries}
        />

        <StatCard
          title="Completed Deliveries"
          value={stats.completed_deliveries}
        />
      </div>
    </div>
  );
}