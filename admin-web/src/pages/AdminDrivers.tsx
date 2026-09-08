import { useEffect, useMemo, useState } from "react";
import AdminDriverDetails from "./AdminDriverDetails";

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriverId, setSelectedDriverId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://192.168.1.37:5000/api/admin/drivers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Admin drivers data:", data);

        if (response.ok && data.drivers) {
          setDrivers(data.drivers);
        }
      } catch (error) {
        console.error("Drivers fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return drivers.filter((driver) => {
      return (
        term === "" ||
        driver.id.toString().includes(term) ||
        driver.name.toLowerCase().includes(term) ||
        driver.email.toLowerCase().includes(term) ||
        (driver.phone || "").toLowerCase().includes(term)
      );
    });
  }, [drivers, searchTerm]);

  if (selectedDriverId !== null) {
    return (
      <AdminDriverDetails
        driverId={selectedDriverId}
        onBack={() => setSelectedDriverId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-56 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Controls Skeleton */}
          <div className="mb-4 h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 sm:max-w-xs" />

          {/* Table Skeleton */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Phone",
                      "Joined",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <tr
                      key={index}
                      className="animate-pulse"
                    >
                      <td className="px-4 py-4">
                        <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Driver Management
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {filteredDrivers.length} of {drivers.length} drivers shown
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative w-full sm:max-w-xs">

            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-400/10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">

              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    ID
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Name
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Email
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Phone
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Joined
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDrivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center"
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">
                        No drivers found
                      </p>

                      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Try changing your search term.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >

                      {/* ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        #{driver.id}
                      </td>

                      {/* Name */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {driver.name}
                      </td>

                      {/* Email */}
                      <td
                        className="max-w-[180px] truncate px-4 py-3 text-slate-600 dark:text-slate-300"
                        title={driver.email}
                      >
                        {driver.email}
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                        {driver.phone || (
                          <span className="text-slate-400 dark:text-slate-500">
                            —
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                        {new Date(
                          driver.created_at
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <button
                          onClick={() =>
                            setSelectedDriverId(driver.id)
                          }
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
                        >
                          View Details
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
}