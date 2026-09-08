import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "driver" | "admin";
  created_at: string;
  updated_at: string;
};

type AdminUserDetailsProps = {
  userId: number;
  onBack: () => void;
};

export default function AdminUserDetails({
  userId,
  onBack,
}: AdminUserDetailsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          `http://192.168.1.37:5000/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Admin user details:", data);

        if (response.ok && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("User details error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-slate-200" />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-4 w-64 rounded bg-slate-200" />
                <div className="h-4 w-48 rounded bg-slate-200" />
                <div className="h-4 w-56 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={onBack}
            className="mb-6 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white"
          >
            ← Back
          </button>

          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-slate-900">
              User not found
            </p>

            <p className="mt-1 text-sm text-slate-400">
              The requested user could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const roleStyles: Record<string, string> = {
    admin:
      "bg-violet-50 text-violet-700 ring-violet-600/20",
    driver:
      "bg-sky-50 text-sky-700 ring-sky-600/20",
    customer:
      "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  const roleStyle =
    roleStyles[user.role] ??
    "bg-slate-100 text-slate-600 ring-slate-500/20";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            User Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            User #{user.id} account information
          </p>
        </div>

        {/* User Overview */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                User ID
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                #{user.id}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Role
              </p>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${roleStyle}`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Account Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Name */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {user.name}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p
                className="mt-1 max-w-[500px] truncate text-sm text-slate-600"
                title={user.email}
              >
                {user.email}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Phone
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {user.phone || (
                  <span className="text-slate-400">
                    —
                  </span>
                )}
              </p>
            </div>

            {/* Role */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Account Role
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Activity
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Created */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Account Created
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {new Date(
                  user.created_at
                ).toLocaleString()}
              </p>
            </div>

            {/* Updated */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {new Date(
                  user.updated_at
                ).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}