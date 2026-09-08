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
    return <p>Loading delivery details...</p>;
  }

  if (!delivery) {
    return (
      <div>
        <button onClick={onBack}>
          ← Back
        </button>

        <p>Delivery not found.</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack}>
        ← Back
      </button>

      <h1>Delivery Details</h1>

      <p>
        <strong>Delivery ID:</strong>{" "}
        {delivery.id}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {delivery.status}
      </p>

      <h2>Customer</h2>

      <p>
        <strong>Name:</strong>{" "}
        {delivery.customer_name || "-"}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {delivery.customer_email || "-"}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {delivery.customer_phone || "-"}
      </p>

      <h2>Driver</h2>

      <p>
        <strong>Name:</strong>{" "}
        {delivery.driver_name || "Unassigned"}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {delivery.driver_email || "-"}
      </p>

      <p>
        <strong>Phone:</strong>{" "}
        {delivery.driver_phone || "-"}
      </p>

      <h2>Delivery Information</h2>

      <p>
        <strong>Pickup:</strong>{" "}
        {delivery.pickup_address}
      </p>

      <p>
        <strong>Destination:</strong>{" "}
        {delivery.delivery_address}
      </p>

      <p>
        <strong>Package:</strong>{" "}
        {delivery.package_description}
      </p>

      <p>
        <strong>Weight:</strong>{" "}
        {delivery.package_weight} kg
      </p>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(
          delivery.created_at
        ).toLocaleString()}
      </p>

      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(
          delivery.updated_at
        ).toLocaleString()}
      </p>
    </div>
  );
}