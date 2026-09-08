type AdminSidebarProps = {
  onDashboard: () => void;
  onUsers: () => void;
  onDeliveries: () => void;
  onDrivers: () => void;
  onLogout: () => void;
};

export default function AdminSidebar({
  onDashboard,
  onUsers,
  onDeliveries,
  onDrivers,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <h2>SwiftDrop</h2>

      <nav>
        <button onClick={onDashboard}>
          Dashboard
        </button>

        <button onClick={onUsers}>
          Users
        </button>

        <button onClick={onDeliveries}>
          Deliveries
        </button>

        <button onClick={onDrivers}>
          Drivers
        </button>

        <button onClick={onLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
}