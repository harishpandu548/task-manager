"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { User, Role } from "@/lib/types";
import { Shield, Users, Plus, UserCheck, UserX, Edit3, Trash2 } from "lucide-react";

const roleColors: Record<Role, { bg: string; text: string }> = {
  ADMIN: { bg: "bg-red-500/10", text: "text-red-400" },
  MANAGER: { bg: "bg-purple-500/10", text: "text-purple-400" },
  EMPLOYEE: { bg: "bg-blue-500/10", text: "text-blue-400" },
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", role: "EMPLOYEE" as Role });
  const [creating, setCreating] = useState(false);

  const fetchUsers = () => {
    api.get("/users")
      .then((res) => setUsers(res.data.data.users || res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/users", form);
      setShowCreate(false);
      setForm({ email: "", password: "", firstName: "", lastName: "", role: "EMPLOYEE" });
      fetchUsers();
    } catch {}
    setCreating(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await api.patch(`/users/${id}`, { isActive: !isActive });
    fetchUsers();
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Manage users and system settings
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[hsl(245,82%,67%/0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 text-center">
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Total Users</p>
          </div>
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 text-center">
            <p className="text-3xl font-bold text-emerald-400">{users.filter((u) => u.isActive !== false).length}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Active</p>
          </div>
          <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{users.filter((u) => u.isActive === false).length}</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Inactive</p>
          </div>
        </div>

        {/* Create form */}
        {showCreate && (
          <form
            onSubmit={handleCreate}
            className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] p-6 space-y-4 animate-fade-in"
          >
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">
              Create New User
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
                className="px-4 py-2.5 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)]"
              />
              <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
                className="px-4 py-2.5 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)]"
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="px-4 py-2.5 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)]"
              />
              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="px-4 py-2.5 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.3)]"
              />
            </div>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="px-4 py-2.5 rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-sm outline-none"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create User"}
            </button>
          </form>
        )}

        {/* User table */}
        <div className="rounded-3xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--border))]">
                <th className="text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-6 py-4">Role</th>
                <th className="text-left text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-8 rounded-xl bg-[hsl(var(--secondary))] animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : (
                users.map((user) => {
                  const rc = roleColors[user.role];
                  return (
                    <tr key={user.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary)/0.5)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[hsl(var(--muted-foreground))]">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${rc.bg} ${rc.text}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isActive !== false ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <UserCheck className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <UserX className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleActive(user.id, user.isActive !== false)}
                          className="p-2 rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                          title={user.isActive !== false ? "Deactivate" : "Activate"}
                        >
                          {user.isActive !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
