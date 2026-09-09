import { useEffect, useState } from "react";

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "driver";
  created_at: string;
  updated_at: string;
};

type AdminDriverDetailsProps = {
  driverId: number;
  onBack: () => void;
};

export default function AdminDriverDetails({
  driverId,
  onBack,
}: AdminDriverDetailsProps) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          `http://192.168.1.37:5000/api/admin/drivers/${driverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Admin driver details:", data);

        if (response.ok && data.driver) {
          setDriver(data.driver);
        }
      } catch (error) {
        console.error("Driver details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-5">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-56 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={onBack}
            className="mb-6 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
          >
            ← Back
          </button>

          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-white">
              Driver not found
            </p>

            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              The requested driver could not be found.
            </p>
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
          <button
            onClick={onBack}
            className="mb-5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Driver Details
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Driver #{driver.id} account information
          </p>
        </div>

        {/* Driver Overview */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Driver ID
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                #{driver.id}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Role
              </p>

              <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400">
                Driver
              </span>
            </div>

          </div>
        </div>

        {/* Account Information */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
            Account Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Name */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {driver.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </p>

              <p
                className="mt-1 max-w-[500px] truncate text-sm text-slate-600 dark:text-slate-300"
                title={driver.email}
              >
                {driver.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Phone
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {driver.phone || (
                  <span className="text-slate-400 dark:text-slate-500">
                    —
                  </span>
                )}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Account Role
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-slate-900 dark:text-slate-100">
                {driver.role}
              </p>
            </div>

          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-lg font-semibold text-slate-900 dark:text-white">
            Activity
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Created */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Account Created
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {new Date(driver.created_at).toLocaleString()}
              </p>
            </div>

            {/* Updated */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {new Date(driver.updated_at).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}