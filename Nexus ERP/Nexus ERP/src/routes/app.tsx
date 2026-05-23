import { useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  ArrowLeft,
  Sparkles,
  LogOut,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Vendas", href: "/app/vendas", icon: ShoppingCart },
  { label: "Compras", href: "/app/compras", icon: Package },
  { label: "RH", href: "/app/rh", icon: Users },
  { label: "Financeiro", href: "/app/financeiro", icon: DollarSign },
  { label: "Relatórios", href: "/app/relatorios", icon: BarChart3 },
];

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    if (!user && !redirected.current) {
      redirected.current = true;
      navigate({ to: "/login" });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/5 bg-background/95 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 border-b border-white/5 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-black uppercase tracking-[0.2em]">Nexus ERP</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-3 space-y-2">
          <div className="px-3 py-2">
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao site
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
