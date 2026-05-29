"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { Bell, Search } from "lucide-react";
import api from "@/lib/api";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, fetchUser } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ tasks: any[]; projects: any[] }>({ tasks: [], projects: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchNotifications();
  }, [fetchUser]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const [tasksRes, projectsRes] = await Promise.all([
            api.get(`/tasks?search=${searchQuery}`),
            api.get(`/projects?search=${searchQuery}`)
          ]);

          const taskData = tasksRes.data?.data?.tasks || [];
          const projectData = Array.isArray(projectsRes.data?.data) ? projectsRes.data.data : [];

          setSearchResults({
            tasks: taskData.slice(0, 5),
            projects: projectData.slice(0, 5)
          });
          setShowResults(true);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] animate-pulse-glow" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))/80] backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-3 flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
            />
            
            {/* Search Results Overlay */}
            {showResults && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/5" 
                  onClick={() => setShowResults(false)}
                />
                <div className="absolute top-12 left-0 w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in max-h-[400px] overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-[hsl(var(--muted-foreground))]">Searching...</div>
                  ) : (searchResults.tasks.length === 0 && searchResults.projects.length === 0) ? (
                    <div className="p-4 text-center text-xs text-[hsl(var(--muted-foreground))]">No results found for "{searchQuery}"</div>
                  ) : (
                    <div className="p-2 space-y-4">
                      {searchResults.projects.length > 0 && (
                        <div>
                          <h4 className="px-3 py-1 text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Projects</h4>
                          {searchResults.projects.map(p => (
                            <button 
                              key={p.id}
                              onClick={() => { router.push(`/projects/${p.id}`); setShowResults(false); setSearchQuery(""); }}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors text-left"
                            >
                              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                              <span className="text-sm font-medium">{p.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.tasks.length > 0 && (
                        <div>
                          <h4 className="px-3 py-1 text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Tasks</h4>
                          {searchResults.tasks.map(t => (
                            <button 
                              key={t.id}
                              onClick={() => { router.push(`/tasks?id=${t.id}`); setShowResults(false); setSearchQuery(""); }}
                              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[hsl(var(--secondary))] transition-colors text-left"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{t.title}</p>
                                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">{t.project?.name || "No Project"}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${showNotifications ? 'bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]' : 'hover:bg-[hsl(var(--secondary))]'}`}
              >
                <Bell className={`w-5 h-5 ${showNotifications ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[hsl(var(--destructive))] rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-[hsl(var(--background))] animate-bounce-subtle">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/0" onClick={() => setShowNotifications(false)} />
                  <div className="absolute top-12 right-0 w-80 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-[hsl(var(--border))] flex justify-between items-center bg-[hsl(var(--secondary)/0.1)]">
                      <h3 className="text-sm font-bold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-[10px] font-bold text-[hsl(var(--primary))] hover:underline uppercase tracking-wider"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.data?.taskId) router.push(`/tasks?id=${n.data.taskId}`);
                              else if (n.data?.projectId) router.push(`/projects/${n.data.projectId}`);
                              setShowNotifications(false);
                            }}
                            className={`p-4 border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--secondary)/0.5)] transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-[hsl(var(--primary)/0.03)]' : ''}`}
                          >
                            {!n.isRead && (
                              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
                            )}
                            <p className="text-xs font-bold leading-tight pr-4">{n.title}</p>
                            <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-2 opacity-60">
                              {new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center">
                            <Bell className="w-6 h-6 text-[hsl(var(--muted-foreground))]" />
                          </div>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">All caught up!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(245,82%,67%)] to-[hsl(262,83%,68%)] flex items-center justify-center text-white text-xs font-bold border border-white/10 shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
