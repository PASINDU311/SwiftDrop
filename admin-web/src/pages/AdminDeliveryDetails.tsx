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

  const [loading, setLoading] = useState(true);

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
    statusDots[delivery.status] ?? "bg-slate-400";

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

                {delivery.status.replace("_", " ")}
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
                  {delivery.driver_name || "Unassigned"}
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

        {/* Timestamps */}
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