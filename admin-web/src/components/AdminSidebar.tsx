type AdminSidebarProps = {
  onDashboard: () => void;
  onUsers: () => void;
  onDeliveries: () => void;
};

export default function AdminSidebar({
  onDashboard,
  onUsers,
  onDeliveries,
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
      </nav>
    </aside>
  );
}