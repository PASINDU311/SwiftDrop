import { useEffect, useMemo, useState } from "react";
import AdminUserDetails from "./AdminUserDetails";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "driver" | "admin";
  created_at: string;
};

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "driver", label: "Drivers" },
  { value: "admin", label: "Admins" },
];

const ROLE_STYLES: Record<string, string> = {
  admin:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20",

  driver:
    "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/20",

  customer:
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600/30",
};

function RoleBadge({ role }: { role: string }) {
  const style =
    ROLE_STYLES[role] ??
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600/30";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      {role}
    </span>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://192.168.1.37:5000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Admin users data:", data);

        if (response.ok && data.users) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Users fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      const matchesSearch =
        term === "" ||
        user.id.toString().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.phone || "").toLowerCase().includes(term);

      return matchesRole && matchesSearch;
    });
  }, [users, searchTerm, roleFilter]);

  if (selectedUserId !== null) {
    return (
      <AdminUserDetails
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-52 rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-2 h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Controls Skeleton */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 sm:max-w-xs" />

            <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 sm:w-48" />
          </div>

          {/* Table Skeleton */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900">
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Phone",
                      "Role",
                      "Created At",
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
                  {Array.from({ length: 6 }).map(
                    (_, index) => (
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
                          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                        </td>

                        <td className="px-4 py-4">
                          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                        </td>

                        <td className="px-4 py-4">
                          <div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Users Management
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {filteredUsers.length} of {users.length} users shown
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Search */}
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 sm:w-48"
          >
            {ROLE_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left text-sm">

              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900">

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
                    Role
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Created At
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-16 text-center"
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Try changing your search or role filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                    >

                      {/* ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-white">
                        #{user.id}
                      </td>

                      {/* Name */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {user.name}
                      </td>

                      {/* Email */}
                      <td
                        className="max-w-[180px] truncate px-4 py-3 text-slate-600 dark:text-slate-300"
                        title={user.email}
                      >
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-300">
                        {user.phone || (
                          <span className="text-slate-400 dark:text-slate-600">
                            —
                          </span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Created At */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3">

                        <button
                          onClick={() =>
                            setSelectedUserId(user.id)
                          }
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-white dark:hover:text-slate-900"
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