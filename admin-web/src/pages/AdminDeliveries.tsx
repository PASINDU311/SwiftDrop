import { useEffect, useState } from "react";
import AdminDeliveryDetails from "./AdminDeliveryDetails";

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

  if (selectedDeliveryId !== null) {
    return (
      <AdminDeliveryDetails
        deliveryId={selectedDeliveryId}
        onBack={() => setSelectedDeliveryId(null)}
      />
    );
  }

  return (
    <div>
      <h1>Delivery Management</h1>
      <input
        type="text"
        placeholder="Search by ID or customer name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Deliveries</option>
        <option value="pending">Pending</option>
        <option value="accepted">Accepted</option>
        <option value="picked_up">Picked Up</option>
        <option value="in_transit">In Transit</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
            {deliveries
                .filter((delivery) => {
                    const matchesStatus =
                        statusFilter === "all" || delivery.status === statusFilter;

                    const matchesSearch =
                        delivery.id.toString().includes(searchTerm.toLowerCase()) ||
                        (delivery.customer_name || "")
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());

                        return matchesStatus && matchesSearch;
                    })
                    .map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.id}</td>

              <td>
                {delivery.customer_name || "-"}
              </td>

              <td>
                {delivery.driver_name || "Unassigned"}
              </td>

              <td>
                {delivery.pickup_address}
              </td>

              <td>
                {delivery.delivery_address}
              </td>

              <td>
                {delivery.package_description}
              </td>

              <td>
                {delivery.package_weight} kg
              </td>

              <td>
                {delivery.status}
              </td>

              <td>
                <button
                  onClick={() =>
                    setSelectedDeliveryId(delivery.id)
                  }
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}