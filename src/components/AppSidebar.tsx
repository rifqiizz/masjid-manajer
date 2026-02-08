import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Megaphone,
  CalendarDays,
  DoorOpen,
  KeyRound,
  Wrench,
  Wallet,
  BarChart3,
  Shield,
  LogOut,
} from "lucide-react";
import mosqueLogo from "@/assets/mosque-logo.png";
import { NavLink } from "@/components/NavLink";

const menuGroups = [
  {
    label: "Utama",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Profil Masjid", url: "/profil-masjid", icon: Building2 },
    ],
  },
  {
    label: "Konten",
    items: [
      { title: "Artikel", url: "/artikel", icon: FileText },
      { title: "Postingan", url: "/postingan", icon: Megaphone },
    ],
  },
  {
    label: "Operasional",
    items: [
      { title: "Kegiatan", url: "/kegiatan", icon: CalendarDays },
      { title: "Ruangan", url: "/ruangan", icon: DoorOpen },
      { title: "Sewa", url: "/sewa", icon: KeyRound },
      { title: "Fasilitas", url: "/fasilitas", icon: Wrench },
    ],
  },
  {
    label: "Keuangan",
    items: [
      { title: "Keuangan", url: "/keuangan", icon: Wallet },
      { title: "Laporan", url: "/laporan", icon: BarChart3 },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Audit Trail", url: "/audit-trail", icon: Shield },
    ],
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img src={mosqueLogo} alt="Logo" className="h-9 w-9" />
        <div>
          <h2 className="text-sm font-bold text-sidebar-foreground">DKM Masjid</h2>
          <p className="text-xs text-sidebar-primary">Panel Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-primary/60">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <li key={item.url}>
                    <NavLink
                      to={item.url}
                      end
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent ${
                        isActive ? "" : ""
                      }`}
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
