import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

function App() {
  const isLoggedIn = !!localStorage.getItem("adminToken");

  return isLoggedIn ? <AdminUsers /> : <AdminLogin />;
}

export default App;