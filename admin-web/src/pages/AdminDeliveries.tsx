import { useEffect, useMemo, useState } from "react";
import AdminDeliveryDetails from "./AdminDeliveryDetails";

type Delivery = {
  id: number;
  customer_id: number;
  driver_id: number | null;
  pickup_address: string;
  delivery_address: string;
  package_description: string;
  package_weight: number;
  delivery_fee: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name: string | null;
  driver_name: string | null;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All deliveries" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "picked_up", label: "Picked up" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES: Record<string, string> = {
  pending:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400",
  accepted:
    "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400",
  picked_up:
    "bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/10 dark:text-violet-400",
  in_transit:
    "bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400",
  delivered:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400",
  cancelled:
    "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-500",
  accepted: "bg-sky-500",
  picked_up: "bg-violet-500",
  in_transit: "bg-orange-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] ??
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400";

  const dot = STATUS_DOT[status] ?? "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status.replace("_", " ")}
    </span>
  );
}

function TableSkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 10 }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className="h-3 rounded bg-slate-200 dark:bg-slate-800"
            style={{ width: `${60 + (i % 3) * 15}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeliveryId, setSelectedDeliveryId] =
    useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          "http://192.168.1.37:5000/api/admin/deliveries",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("Admin deliveries data:", data);

        if (response.ok && data.deliveries) {
          setDeliveries(data.deliveries);
        } else {
          setError("Couldn't load deliveries. Please try again.");
        }
      } catch (error) {
        console.error("Deliveries fetch error:", error);
        setError("Couldn't reach the server. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const filteredDeliveries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return deliveries.filter((delivery) => {
      const matchesStatus =
        statusFilter === "all" || delivery.status === statusFilter;

      const matchesSearch =
        delivery.id.toString().includes(term) ||
        (delivery.customer_name || "")
          .toLowerCase()
          .includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [deliveries, statusFilter, searchTerm]);

  if (selectedDeliveryId !== null) {
    return (
      <AdminDeliveryDetails
        deliveryId={selectedDeliveryId}
        onBack={() => setSelectedDeliveryId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Delivery management
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading deliveries…"
              : `${filteredDeliveries.length} of ${deliveries.length} deliveries shown`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>

            <input
              type="text"
              placeholder="Search by ID or customer name…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-400/10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:ring-slate-400/10 sm:w-56"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-200"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
                  {[
                    "ID",
                    "Customer",
                    "Driver",
                    "Pickup",
                    "Destination",
                    "Package",
                    "Weight",
                    "Fee",
                    "Status",
                    "",
                  ].map((heading, index) => (
                    <th
                      key={`${heading}-${index}`}
                      className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableSkeletonRow key={i} />
                  ))
                ) : filteredDeliveries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-16 text-center"
                    >
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        No deliveries match your filters
                      </p>

                      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Try a different search term or status.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      {/* ID */}
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        #{delivery.id}
                      </td>

                      {/* Customer */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                        {delivery.customer_name || "—"}
                      </td>

                      {/* Driver */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                        {delivery.driver_name || (
                          <span className="text-slate-400 dark:text-slate-500">
                            Unassigned
                          </span>
                        )}
                      </td>

                      {/* Pickup */}
                      <td
                        className="max-w-[180px] truncate px-4 py-3 text-slate-600 dark:text-slate-400"
                        title={delivery.pickup_address}
                      >
                        {delivery.pickup_address}
                      </td>

                      {/* Destination */}
                      <td
                        className="max-w-[180px] truncate px-4 py-3 text-slate-600 dark:text-slate-400"
                        title={delivery.delivery_address}
                      >
                        {delivery.delivery_address}
                      </td>

                      {/* Package */}
                      <td
                        className="max-w-[160px] truncate px-4 py-3 text-slate-600 dark:text-slate-400"
                        title={delivery.package_description}
                      >
                        {delivery.package_description}
                      </td>

                      {/* Weight */}
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600 dark:text-slate-400">
                        {delivery.package_weight} kg
                      </td>

                      {/* Fee */}
                      <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {delivery.delivery_fee !== null
                          ? `Rs. ${Number(
                              delivery.delivery_fee
                            ).toFixed(2)}`
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusBadge status={delivery.status} />
                      </td>

                      {/* Actions */}
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            setSelectedDeliveryId(delivery.id)
                          }
                          className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-900 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-white dark:hover:text-slate-900"
                        >
                          View details
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