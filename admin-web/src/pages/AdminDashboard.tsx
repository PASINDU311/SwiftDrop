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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            SwiftDrop Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your delivery platform
          </p>
        </div>

        {/* Statistics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Statistics
          </h2>

          <div
            className="
              grid grid-cols-1 gap-4
              sm:grid-cols-2
              lg:grid-cols-4
              [&>div]:rounded-xl
              [&>div]:border
              [&>div]:border-slate-200
              [&>div]:bg-white
              [&>div]:p-6
              [&>div]:shadow-sm
              [&>div]:transition-shadow
              [&>div]:hover:shadow-md
              [&>div>h3]:mb-2
              [&>div>h3]:text-sm
              [&>div>h3]:font-medium
              [&>div>h3]:text-slate-500
              [&>div>p]:text-3xl
              [&>div>p]:font-semibold
              [&>div>p]:tracking-tight
              [&>div>p]:text-slate-900
            "
          >
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
      </div>
    </div>
  );
}