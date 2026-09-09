import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";

type RecentDelivery = {
  id: number;
  pickup_address: string;
  delivery_address: string;
  delivery_fee: number | null;
  status: string;
  created_at: string;
  customer_name: string | null;
  driver_name: string | null;
};

type DriverApplication = {
  id: number;
  status: "pending" | "approved" | "rejected";
};

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",

  accepted:
    "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20",

  picked_up:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20",

  in_transit:
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/20",

  delivered:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",

  cancelled:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400 dark:ring-rose-400/20",
};

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const style =
    STATUS_STYLES[status] ??
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600/30";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

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

  const [pendingDriverApplications, setPendingDriverApplications] =
    useState(0);

  const [recentDeliveries, setRecentDeliveries] =
    useState<RecentDelivery[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token =
          localStorage.getItem("adminToken");

        const [dashboardResponse, applicationsResponse] =
          await Promise.all([
            fetch(
              "http://192.168.1.37:5000/api/admin/dashboard",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            fetch(
              "http://192.168.1.37:5000/api/admin/driver-applications",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        const dashboardData =
          await dashboardResponse.json();

        const applicationsData =
          await applicationsResponse.json();

        console.log(
          "Admin dashboard data:",
          dashboardData
        );

        if (
          dashboardResponse.ok &&
          dashboardData.statistics
        ) {
          setStats(dashboardData.statistics);

          setRecentDeliveries(
            dashboardData.recent_deliveries || []
          );
        }

        if (
          applicationsResponse.ok &&
          applicationsData.applications
        ) {
          const pendingCount =
            applicationsData.applications.filter(
              (application: DriverApplication) =>
                application.status === "pending"
            ).length;

          setPendingDriverApplications(
            pendingCount
          );
        }
      } catch (error) {
        console.error(
          "Dashboard stats error:",
          error
        );
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            SwiftDrop Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview of your delivery platform
          </p>
        </div>

        {/* Statistics */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
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
              [&>div]:transition-all

              dark:[&>div]:border-slate-800
              dark:[&>div]:bg-slate-950
              dark:[&>div]:shadow-none

              [&>div]:hover:shadow-md

              [&>div>h3]:mb-2
              [&>div>h3]:text-sm
              [&>div>h3]:font-medium
              [&>div>h3]:text-slate-500
              dark:[&>div>h3]:text-slate-400

              [&>div>p]:text-3xl
              [&>div>p]:font-semibold
              [&>div>p]:tracking-tight
              [&>div>p]:text-slate-900
              dark:[&>div>p]:text-white
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

            <StatCard
              title="Pending Driver Applications"
              value={pendingDriverApplications}
            />
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="mt-8">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Deliveries
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Latest delivery activity on the platform
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">

            {recentDeliveries.length === 0 ? (
              <div className="px-6 py-12 text-center">

                <p className="font-semibold text-slate-900 dark:text-white">
                  No recent deliveries
                </p>

                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  There are currently no delivery records.
                </p>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px] text-left text-sm">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900">

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        ID
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Customer
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Route
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Driver
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Fee
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Status
                      </th>

                      <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Created
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                    {recentDeliveries.map(
                      (delivery) => (
                        <tr
                          key={delivery.id}
                          className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                        >

                          {/* ID */}
                          <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900 dark:text-white">
                            #{delivery.id}
                          </td>

                          {/* Customer */}
                          <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">
                            {delivery.customer_name || (
                              <span className="text-slate-400 dark:text-slate-600">
                                —
                              </span>
                            )}
                          </td>

                          {/* Route */}
                          <td className="px-4 py-4">
                            <div className="max-w-[320px]">

                              <p
                                className="truncate text-sm font-medium text-slate-700 dark:text-slate-300"
                                title={
                                  delivery.pickup_address
                                }
                              >
                                {
                                  delivery.pickup_address
                                }
                              </p>

                              <p className="my-1 text-xs text-slate-400 dark:text-slate-600">
                                ↓
                              </p>

                              <p
                                className="truncate text-sm text-slate-500 dark:text-slate-400"
                                title={
                                  delivery.delivery_address
                                }
                              >
                                {
                                  delivery.delivery_address
                                }
                              </p>

                            </div>
                          </td>

                          {/* Driver */}
                          <td className="whitespace-nowrap px-4 py-4 text-slate-600 dark:text-slate-300">
                            {delivery.driver_name || (
                              <span className="text-slate-400 dark:text-slate-600">
                                Unassigned
                              </span>
                            )}
                          </td>

                          {/* Fee */}
                          <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900 dark:text-white">
                            {delivery.delivery_fee !==
                            null
                              ? `Rs. ${Number(
                                  delivery.delivery_fee
                                ).toFixed(2)}`
                              : "—"}
                          </td>

                          {/* Status */}
                          <td className="whitespace-nowrap px-4 py-4">
                            <StatusBadge
                              status={
                                delivery.status
                              }
                            />
                          </td>

                          {/* Created */}
                          <td className="whitespace-nowrap px-4 py-4 text-slate-500 dark:text-slate-400">
                            {new Date(
                              delivery.created_at
                            ).toLocaleDateString()}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}