import { useEffect, useState } from "react";

type Delivery = {
  id: number;
  customer_id: number;
  driver_id: number | null;
  pickup_address: string;
  delivery_address: string;
  package_description: string;
  package_weight: number;
  status: string;
  created_at: string;
  updated_at: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  driver_name: string | null;
  driver_email: string | null;
  driver_phone: string | null;
};

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

type AdminDeliveryDetailsProps = {
  deliveryId: number;
  onBack: () => void;
};

export default function AdminDeliveryDetails({
  deliveryId,
  onBack,
}: AdminDeliveryDetailsProps) {
  const [delivery, setDelivery] =
    useState<Delivery | null>(null);

  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(true);
  const [driversLoading, setDriversLoading] =
    useState(false);
  const [assigning, setAssigning] = useState(false);

  const [selectedDriverId, setSelectedDriverId] =
    useState("");

  const [assignMessage, setAssignMessage] =
    useState("");

  const [assignError, setAssignError] =
    useState("");

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(
          `http://192.168.1.37:5000/api/admin/deliveries/${deliveryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log(
          "Admin delivery details:",
          data
        );

        if (response.ok && data.delivery) {
          setDelivery(data.delivery);
        }
      } catch (error) {
        console.error(
          "Delivery details error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [deliveryId]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setDriversLoading(true);

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

        console.log(
          "Admin drivers for assignment:",
          data
        );

        if (response.ok && data.drivers) {
          setDrivers(data.drivers);
        }
      } catch (error) {
        console.error(
          "Drivers fetch error:",
          error
        );
      } finally {
        setDriversLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleAssignDriver = async () => {
    if (!selectedDriverId) {
      setAssignError("Please select a driver.");
      setAssignMessage("");
      return;
    }

    try {
      setAssigning(true);
      setAssignError("");
      setAssignMessage("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://192.168.1.37:5000/api/admin/deliveries/${deliveryId}/assign-driver`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            driver_id: Number(selectedDriverId),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Assign driver response:",
        data
      );

      if (!response.ok) {
        setAssignError(
          data.message ||
            "Failed to assign driver."
        );
        return;
      }

      setAssignMessage(
        "Driver assigned successfully."
      );

      setSelectedDriverId("");

      // Refresh delivery details
      const refreshedResponse = await fetch(
        `http://192.168.1.37:5000/api/admin/deliveries/${deliveryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const refreshedData =
        await refreshedResponse.json();

      if (
        refreshedResponse.ok &&
        refreshedData.delivery
      ) {
        setDelivery(refreshedData.delivery);
      }
    } catch (error) {
      console.error(
        "Assign driver error:",
        error
      );

      setAssignError(
        "Something went wrong while assigning the driver."
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">

            <div className="h-9 w-40 rounded bg-slate-200" />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5">
                <div className="h-4 w-32 rounded bg-slate-200" />
                <div className="h-4 w-64 rounded bg-slate-200" />
                <div className="h-4 w-48 rounded bg-slate-200" />
                <div className="h-4 w-56 rounded bg-slate-200" />
              </div>
            </div>

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

  if (!delivery) {
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
              Delivery not found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              The requested delivery could not be found.
            </p>
          </div>

        </div>
      </div>
    );
  }

  const statusStyles: Record<string, string> = {
    pending:
      "bg-amber-50 text-amber-700 ring-amber-600/20",
    accepted:
      "bg-sky-50 text-sky-700 ring-sky-600/20",
    picked_up:
      "bg-violet-50 text-violet-700 ring-violet-600/20",
    in_transit:
      "bg-orange-50 text-orange-700 ring-orange-600/20",
    delivered:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    cancelled:
      "bg-rose-50 text-rose-700 ring-rose-600/20",
  };

  const statusDots: Record<string, string> = {
    pending: "bg-amber-500",
    accepted: "bg-sky-500",
    picked_up: "bg-violet-500",
    in_transit: "bg-orange-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-rose-500",
  };

  const statusStyle =
    statusStyles[delivery.status] ??
    "bg-slate-100 text-slate-600 ring-slate-500/20";

  const statusDot =
    statusDots[delivery.status] ??
    "bg-slate-400";

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
            Delivery Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Delivery #{delivery.id} information and assignment details
          </p>
        </div>

        {/* Overview */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Delivery ID
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                #{delivery.id}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyle}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${statusDot}`}
                />

                {delivery.status.replace(
                  "_",
                  " "
                )}
              </span>
            </div>

          </div>
        </div>

        {/* Customer & Driver */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Customer */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Customer
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {delivery.customer_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {delivery.customer_email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {delivery.customer_phone || "—"}
                </p>
              </div>

            </div>
          </div>

          {/* Driver */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Driver
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Name
                </p>

                <p
                  className={`mt-1 text-sm ${
                    delivery.driver_name
                      ? "font-medium text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {delivery.driver_name ||
                    "Unassigned"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {delivery.driver_email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Phone
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {delivery.driver_phone || "—"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Assign Driver */}
        {delivery.status === "pending" && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Assign Driver
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Assign an available driver to this pending delivery.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

              <div className="w-full sm:max-w-md">
                <label
                  htmlFor="driver-select"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Select Driver
                </label>

                <select
                  id="driver-select"
                  value={selectedDriverId}
                  onChange={(e) => {
                    setSelectedDriverId(
                      e.target.value
                    );
                    setAssignError("");
                    setAssignMessage("");
                  }}
                  disabled={
                    driversLoading || assigning
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="">
                    {driversLoading
                      ? "Loading drivers..."
                      : "Select a driver"}
                  </option>

                  {drivers.map((driver) => (
                    <option
                      key={driver.id}
                      value={driver.id}
                    >
                      {driver.name} — {driver.email}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAssignDriver}
                disabled={
                  !selectedDriverId ||
                  assigning ||
                  driversLoading
                }
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigning
                  ? "Assigning..."
                  : "Assign Driver"}
              </button>

            </div>

            {drivers.length === 0 &&
              !driversLoading && (
                <p className="mt-3 text-sm text-slate-400">
                  No drivers are currently registered.
                </p>
              )}

            {assignMessage && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {assignMessage}
              </div>
            )}

            {assignError && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {assignError}
              </div>
            )}

          </div>
        )}

        {/* Delivery Information */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Pickup Address
              </p>

              <p
                className="mt-1 max-w-[500px] truncate text-sm text-slate-600"
                title={delivery.pickup_address}
              >
                {delivery.pickup_address}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Destination
              </p>

              <p
                className="mt-1 max-w-[500px] truncate text-sm text-slate-600"
                title={delivery.delivery_address}
              >
                {delivery.delivery_address}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Package
              </p>

              <p
                className="mt-1 max-w-[500px] truncate text-sm text-slate-600"
                title={delivery.package_description}
              >
                {delivery.package_description}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Weight
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {delivery.package_weight} kg
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

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {new Date(
                  delivery.created_at
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {new Date(
                  delivery.updated_at
                ).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}