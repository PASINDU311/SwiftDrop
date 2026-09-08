import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "driver" | "admin";
  created_at: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-52 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
          </div>

          {/* Table Skeleton */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Phone",
                      "Role",
                      "Created At",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
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
                        <div className="h-3 w-20 rounded bg-slate-200" />
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
            Users Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {users.length} users registered
          </p>
        </div>

        {/* Table */}
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
                    Role
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Created At
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center"
                    >
                      <p className="font-semibold text-slate-900">
                        No users found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        There are currently no registered users.
                      </p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        #{user.id}
                      </td>

                      {/* Name */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {user.name}
                      </td>

                      {/* Email */}
                      <td
                        className="max-w-[180px] truncate px-4 py-3 text-slate-600"
                        title={user.email}
                      >
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {user.phone || (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                            user.role === "admin"
                              ? "bg-violet-50 text-violet-700 ring-violet-600/20"
                              : user.role === "driver"
                              ? "bg-sky-50 text-sky-700 ring-sky-600/20"
                              : "bg-slate-100 text-slate-600 ring-slate-500/20"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {new Date(
                          user.created_at
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