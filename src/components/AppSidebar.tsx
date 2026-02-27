import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ExternalLink,
  CalendarDays,
  DoorOpen,
  CalendarCheck,
  Calendar,
  Wrench,
  ArrowUpCircle,
  ArrowDownCircle,
  BarChart3,
  ClipboardList,
  Briefcase,
  Shield,
  LogOut,
  Users,
  UserCog,
  ChevronDown,
  ListTodo,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logoNuruzzaman from "@/assets/logo-nuruzzaman.png";

const menuGroups = [
  {
    label: "Utama",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, iconColor: "text-blue-500" },
      { title: "Profil Masjid", url: "/profil-masjid", icon: Building2, iconColor: "text-amber-600" },
    ],
  },
  {
    label: "Konten",
    items: [
      { title: "Kelola Postingan", url: "https://masjidnz.gt.tc/", icon: ExternalLink, iconColor: "text-emerald-500", external: true },
    ],
  },
  {
    label: "Operasional",
    items: [
      { title: "Kegiatan", url: "/kegiatan", icon: CalendarDays, iconColor: "text-purple-500" },
      { title: "Tugas", url: "/tugas", icon: ListTodo, iconColor: "text-orange-500" },
      { title: "Ruangan", url: "/ruangan", icon: DoorOpen, iconColor: "text-cyan-500" },
      { title: "Reservasi", url: "/reservasi", icon: CalendarCheck, iconColor: "text-yellow-500" },
      { title: "Jadwal Reservasi", url: "/jadwal-reservasi", icon: Calendar, iconColor: "text-yellow-600" },
      { title: "Fasilitas", url: "/fasilitas", icon: Wrench, iconColor: "text-slate-500" },
    ],
  },
  {
    label: "Keuangan",
    items: [
      { title: "Pemasukan", url: "/pemasukan", icon: ArrowUpCircle, iconColor: "text-green-500" },
      { title: "Pengeluaran", url: "/pengeluaran", icon: ArrowDownCircle, iconColor: "text-red-500" },
    ],
  },
  {
    label: "Laporan",
    items: [
      { title: "Laporan Publik", url: "/laporan", icon: BarChart3, iconColor: "text-indigo-500" },
      { title: "Laporan Operasional", url: "/laporan-operasional", icon: ClipboardList, iconColor: "text-blue-500" },
      { title: "Laporan Eksekutif", url: "/laporan-eksekutif", icon: Briefcase, iconColor: "text-amber-600" },
    ],
  },
  {
    label: "Data & Pengguna",
    items: [
      { title: "Jamaah", url: "/jamaah", icon: Users, iconColor: "text-teal-500" },
      { title: "Manajemen User", url: "/users", icon: UserCog, iconColor: "text-rose-500" },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Audit Trail", url: "/audit-trail", icon: Shield, iconColor: "text-red-500" },
    ],
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize collapsed state — expand group containing current route
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    menuGroups.forEach((g) => {
      const hasActive = g.items.some((i) => !(i as any).external && location.pathname === i.url);
      state[g.label] = !hasActive; // collapsed if NOT active
    });
    return state;
  });

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img src={logoNuruzzaman} alt="Logo Masjid Nuruzzaman" className="h-9 w-9" />
        <div>
          <h2 className="text-sm font-bold text-sidebar-foreground">Masjid Nuruzzaman</h2>
          <p className="text-xs text-sidebar-primary">Panel Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuGroups.map((group) => {
          const isCollapsed = collapsedGroups[group.label] ?? false;
          return (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between px-2 py-1.5 mb-1 rounded-md hover:bg-sidebar-accent/50 transition-colors"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.label}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-sidebar-foreground/40 transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}`}
              >
                <ul className="space-y-0.5 pb-2">
                  {group.items.map((item) => {
                    const isExternal = (item as any).external;
                    if (isExternal) {
                      return (
                        <li key={item.url}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
                          >
                            <item.icon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
                            <span>{item.title}</span>
                          </a>
                        </li>
                      );
                    }
                    const isActive = location.pathname === item.url;
                    return (
                      <li key={item.url}>
                        <NavLink
                          to={item.url}
                          end
                          className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent ${
                            isActive ? "" : "text-sidebar-foreground"
                          }`}
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
                          <span>{item.title}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 text-sidebar-foreground/40" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
