import { useEffect, useState } from "react";
import axios from "axios";

type DriverApplication = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
};

function AdminDriverApplications() {
  const [applications, setApplications] = useState<
    DriverApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] =
    useState<number | null>(null);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        "http://localhost:5000/api/admin/driver-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(
        response.data.applications || []
      );
    } catch (error: any) {
      console.error(
        "Failed to load driver applications:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load driver applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (
    applicationId: number,
    status: "approved" | "rejected"
  ) => {
    const action =
      status === "approved"
        ? "approve"
        : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this driver application?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewingId(applicationId);
      setError("");

      const token =
        localStorage.getItem("adminToken");

      await axios.patch(
        `http://localhost:5000/api/admin/driver-applications/${applicationId}/review`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadApplications();
    } catch (error: any) {
      console.error(
        "Failed to review driver application:",
        error
      );

      setError(
        error.response?.data?.message ||
          `Failed to ${action} driver application`
      );
    } finally {
      setReviewingId(null);
    }
  };

  const getStatusClass = (
    status: DriverApplication["status"]
  ) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }

    return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-950 dark:text-white">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Driver Applications
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review customers who applied to become
            SwiftDrop drivers.
          </p>
        </div>

        <button
          onClick={loadApplications}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white" />

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading applications...
            </p>
          </div>
        </div>
      ) : applications.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="text-center">
            <div className="mb-3 text-5xl">
              🚗
            </div>

            <h2 className="text-lg font-bold">
              No driver applications
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are currently no driver
              applications to review.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Vehicle Number
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    License Number
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Submitted
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {applications.map(
                  (application) => (
                    <tr
                      key={application.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Applicant */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <p className="font-semibold">
                            {application.name}
                          </p>

                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {application.email}
                          </p>

                          {application.phone && (
                            <p className="text-xs text-gray-400">
                              {application.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="font-medium">
                          {application.vehicle_type}
                        </span>
                      </td>

                      {/* Vehicle Number */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium dark:bg-gray-800">
                          {application.vehicle_number}
                        </span>
                      </td>

                      {/* License */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium dark:bg-gray-800">
                          {application.license_number}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>

                      {/* Submitted */}
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                          application.submitted_at
                        ).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-6 py-4">
                        {application.status ===
                        "pending" ? (
                          <div className="flex items-center gap-2">
                            {/* Approve */}
                            <button
                              onClick={() =>
                                handleReview(
                                  application.id,
                                  "approved"
                                )
                              }
                              disabled={
                                reviewingId ===
                                application.id
                              }
                              className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {reviewingId ===
                              application.id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            {/* Reject */}
                            <button
                              onClick={() =>
                                handleReview(
                                  application.id,
                                  "rejected"
                                )
                              }
                              disabled={
                                reviewingId ===
                                application.id
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDriverApplications;