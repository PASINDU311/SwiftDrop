import { useState } from "react";
import axios from "axios";

type AdminLoginProps = {
  onLogin: () => void;
};

export default function AdminLogin({
  onLogin,
}: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://192.168.1.37:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log(
        "Admin login response:",
        response.data
      );

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      alert("Login successful!");

      onLogin();
    } catch (error: any) {
      console.error("Admin login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                SwiftDrop Admin
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access the admin panel
              </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <input
                  id="admin-email"
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="admin-password"
                  type="password"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </div>
          </div>

          {/* Footer */}
          <p className="mt-4 text-center text-xs text-slate-400">
            SwiftDrop Admin Panel
          </p>

        </div>
      </div>
    </div>
  );
}