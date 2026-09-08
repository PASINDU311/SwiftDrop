import { useEffect, useState } from "react";

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
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

        console.log("Admin drivers data:", data);

        if (response.ok && data.drivers) {
          setDrivers(data.drivers);
        }
      } catch (error) {
        console.error("Drivers fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) {
    return <p>Loading drivers...</p>;
  }

  return (
    <div>
      <h1>Driver Management</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Joined</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.id}</td>
              <td>{driver.name}</td>
              <td>{driver.email}</td>
              <td>{driver.phone || "-"}</td>
              <td>
                {new Date(
                  driver.created_at
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}