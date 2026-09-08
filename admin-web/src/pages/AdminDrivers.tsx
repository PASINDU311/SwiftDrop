import { useEffect, useState } from "react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-56 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
          </div>

          {/* Table Skeleton */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    {["ID", "Name", "Email", "Phone", "Joined"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <tr
                      key={index}
                      className="animate-pulse"
                    >
                      <td className="px-4 py-4">
                        <div className="h-3 w-12 rounded bg-slate-200" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-32 rounded bg-slate-200" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-48 rounded bg-slate-200" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-28 rounded bg-slate-200" />
                      </td>

                      <td className="px-4 py-4">
                        <div className="h-3 w-24 rounded bg-slate-200" />
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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Driver Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {drivers.length} drivers registered
          </p>
        </div>

        {/* Empty State / Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">

              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    ID
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Name
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Joined
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {drivers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-16 text-center"
                    >
                      <p className="font-semibold text-slate-900">
                        No drivers found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        There are currently no registered drivers.
                      </p>
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        #{driver.id}
                      </td>

                      {/* Name */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {driver.name}
                      </td>

                      {/* Email */}
                      <td
                        className="max-w-[180px] truncate px-4 py-3 text-slate-600"
                        title={driver.email}
                      >
                        {driver.email}
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {driver.phone || (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* Joined */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {new Date(
                          driver.created_at
                        ).toLocaleDateString()}
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