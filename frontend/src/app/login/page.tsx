"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[hsl(245,82%,67%/0.08)] blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[hsl(262,83%,68%/0.06)] blur-3xl" />

      <div className="relative w-full max-w-md mx-4 animate-fade-in">
        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/5">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center shadow-lg shadow-[hsl(245,82%,67%/0.3)] mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Sign in to your workspace
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-[hsl(var(--destructive)/0.08)] border border-[hsl(var(--destructive)/0.2)] text-sm text-[hsl(var(--destructive))]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[hsl(var(--muted-foreground))]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] transition-all placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[hsl(var(--muted-foreground))]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))] transition-all pr-10 placeholder:text-[hsl(var(--muted-foreground)/0.5)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[hsl(245,82%,67%/0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">
            Demo: admin@taskflow.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}
