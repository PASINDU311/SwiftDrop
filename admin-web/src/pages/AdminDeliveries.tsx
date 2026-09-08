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
  driver_name: string | null;
};

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

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
        }
      } catch (error) {
        console.error("Deliveries fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) {
    return <p>Loading deliveries...</p>;
  }

  return (
    <div>
      <h1>Delivery Management</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Driver</th>
            <th>Pickup</th>
            <th>Destination</th>
            <th>Package</th>
            <th>Weight</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.id}</td>
              <td>{delivery.customer_name || "-"}</td>
              <td>{delivery.driver_name || "Unassigned"}</td>
              <td>{delivery.pickup_address}</td>
              <td>{delivery.delivery_address}</td>
              <td>{delivery.package_description}</td>
              <td>{delivery.package_weight} kg</td>
              <td>{delivery.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}