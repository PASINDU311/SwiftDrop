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
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="border-b border-slate-200 px-6 py-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          SwiftDrop
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <button
          onClick={onDashboard}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Dashboard
        </button>

        <button
          onClick={onUsers}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Users
        </button>

        <button
          onClick={onDeliveries}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Deliveries
        </button>

        <button
          onClick={onDrivers}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          Drivers
        </button>
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-200 p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}