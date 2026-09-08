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

      console.log("Admin login response:", response.data);

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
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">

        {/* ================= LEFT HERO ================= */}
        <div className="relative hidden overflow-hidden bg-slate-950 lg:flex lg:w-1/2">

          {/* Soft background glow */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />

          {/* Hero Content */}
          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-slate-950 shadow-lg shadow-amber-400/20">
                  S
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-white">
                    SwiftDrop
                  </p>

                  <p className="text-xs text-slate-400">
                    Delivery Management
                  </p>
                </div>
              </div>
            </div>

            {/* Main Hero */}
            <div className="relative flex-1">

              {/* Animated route pulse */}
              <div className="absolute left-[20%] top-[30%] z-20">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/60 animate-ping" />
              </div>

              <div className="absolute right-[22%] top-[18%] z-20">
                <div className="h-3 w-3 rounded-full bg-sky-400 shadow-lg shadow-sky-400/60 animate-pulse" />
              </div>

              {/* Floating delivery status */}
              <div className="absolute left-2 top-[20%] z-30 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/15">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Delivery Active
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Driver is on the way
                    </p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <img
                src="/images/delivery-hero.png"
                alt="SwiftDrop delivery"
                className="absolute inset-0 h-full w-full object-contain p-6 drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02] xl:p-10"
              />

              {/* Floating destination card */}
              <div className="absolute bottom-[8%] right-2 z-30 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/15">
                    <span className="text-sm">📍</span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      Destination
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Package arriving soon
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="max-w-lg">
              <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
                Deliver smarter.
                <br />
                Move faster.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
                Manage deliveries, drivers and customers
                from one powerful dashboard built for
                modern logistics.
              </p>

              <div className="mt-6 flex items-center gap-6 text-xs text-slate-500">
                <span>✓ Real-time management</span>
                <span>✓ Secure access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT LOGIN ================= */}
        <div className="flex w-full items-center justify-center bg-white px-5 py-10 sm:px-8 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-xl font-bold text-slate-950 shadow-lg shadow-amber-400/20">
                S
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-slate-900">
                  SwiftDrop
                </p>

                <p className="text-xs text-slate-500">
                  Delivery Management
                </p>
              </div>
            </div>

            {/* Login Header */}
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                Admin Portal
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to manage your SwiftDrop
                operations.
              </p>
            </div>

            {/* Login Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

              <div className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-400/10"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="admin-password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <span className="text-xs text-slate-400">
                      Admin access
                    </span>
                  </div>

                  <input
                    id="admin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) {
                        handleLogin();
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-400/10"
                  />
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="relative z-10">
                    {loading
                      ? "Signing in..."
                      : "Sign in to dashboard"}
                  </span>

                  {!loading && (
                    <span className="absolute inset-y-0 right-0 flex w-12 items-center justify-center bg-amber-400 text-slate-950 transition-all duration-300 group-hover:w-14">
                      →
                    </span>
                  )}
                </button>

              </div>
            </div>

            {/* Security Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="10"
                  rx="2"
                />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>

              Secure admin access
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} SwiftDrop
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}