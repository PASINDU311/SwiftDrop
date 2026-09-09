type AdminSidebarProps = {
  darkMode: boolean;
  onToggleTheme: () => void;
  onDashboard: () => void;
  onUsers: () => void;
  onDeliveries: () => void;
  onDrivers: () => void;
  onDriverApplications: () => void;
  onLogout: () => void;
};

export default function AdminSidebar({
  darkMode,
  onToggleTheme,
  onDashboard,
  onUsers,
  onDeliveries,
  onDrivers,
  onDriverApplications,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside
      className={`flex min-h-screen w-64 flex-col border-r transition-colors duration-300 ${
        darkMode
          ? "border-slate-800 bg-slate-950"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Brand */}
      <div
        className={`border-b px-6 py-6 transition-colors duration-300 ${
          darkMode
            ? "border-slate-800"
            : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold transition-colors ${
              darkMode
                ? "bg-amber-400 text-slate-950"
                : "bg-slate-900 text-white"
            }`}
          >
            S
          </div>

          <div>
            <h2
              className={`text-xl font-semibold tracking-tight ${
                darkMode
                  ? "text-white"
                  : "text-slate-900"
              }`}
            >
              SwiftDrop
            </h2>

            <p
              className={`mt-1 text-xs ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {/* Dashboard */}
        <button
          onClick={onDashboard}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            darkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Dashboard
        </button>

        {/* Users */}
        <button
          onClick={onUsers}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            darkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Users
        </button>

        {/* Deliveries */}
        <button
          onClick={onDeliveries}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            darkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Deliveries
        </button>

        {/* Drivers */}
        <button
          onClick={onDrivers}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            darkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Drivers
        </button>

        {/* Driver Applications */}
        <button
          onClick={onDriverApplications}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            darkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          Driver Applications
        </button>
      </nav>

      {/* Bottom Section */}
      <div
        className={`border-t p-3 transition-colors duration-300 ${
          darkMode
            ? "border-slate-800"
            : "border-slate-200"
        }`}
      >
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className={`mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            darkMode
              ? "text-slate-300 hover:bg-slate-800 hover:text-white"
              : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <span>
            {darkMode
              ? "Dark mode"
              : "Light mode"}
          </span>

          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              darkMode
                ? "bg-slate-800"
                : "bg-slate-100"
            }`}
          >
            {darkMode ? "🌙" : "☀️"}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
            darkMode
              ? "text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
              : "text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          }`}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}