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
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logoNuruzzaman from "@/assets/logo-nuruzzaman.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      { title: "Pengaturan Website", url: "/pengaturan", icon: Settings, iconColor: "text-gray-500" },
      { title: "Audit Trail", url: "/audit-trail", icon: Shield, iconColor: "text-red-500" },
    ],
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <img src={logoNuruzzaman} alt="Logo Masjid Nuruzzaman" className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-sidebar-foreground truncate">Masjid Nuruzzaman</h2>
              <p className="text-xs text-sidebar-primary">Panel Admin</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => {
          const hasActive = group.items.some(
            (i) => !(i as any).external && location.pathname === i.url
          );

          return (
            <Collapsible key={group.label} defaultOpen={hasActive || group.label === "Utama"} className="group/collapsible">
              <SidebarGroup>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md transition-colors">
                    <span className="flex-1">{group.label}</span>
                    {!collapsed && (
                      <ChevronDown className="h-3.5 w-3.5 text-sidebar-foreground/40 transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90" />
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isExternal = (item as any).external;
                        const isActive = !isExternal && location.pathname === item.url;

                        return (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={item.title}
                            >
                              {isExternal ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <item.icon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
                                  <span>{item.title}</span>
                                </a>
                              ) : (
                                <NavLink
                                  to={item.url}
                                  end
                                  className="flex items-center"
                                  activeClassName="font-medium"
                                >
                                  <item.icon className={`h-4 w-4 shrink-0 ${item.iconColor}`} />
                                  <span>{item.title}</span>
                                </NavLink>
                              )}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/")} tooltip="Keluar">
              <LogOut className="h-4 w-4 text-sidebar-foreground/40" />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
