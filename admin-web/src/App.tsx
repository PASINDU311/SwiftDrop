import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const isLoggedIn = !!localStorage.getItem("adminToken");

  return isLoggedIn ? <AdminDashboard /> : <AdminLogin />;
}

export default App;