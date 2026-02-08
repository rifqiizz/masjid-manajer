import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Search, User, Clock, FileText, Settings, Wallet, DoorOpen } from "lucide-react";

interface AuditLog {
  id: number;
  waktu: string;
  user: string;
  role: string;
  aksi: string;
  modul: string;
  detail: string;
  ip: string;
}

const initialLogs: AuditLog[] = [
  { id: 1, waktu: "2026-02-08 14:32:15", user: "Ahmad Fauzi", role: "Bendahara", aksi: "Tambah", modul: "Keuangan", detail: "Menambah pemasukan infaq Jumat Rp 3.200.000", ip: "192.168.1.100" },
  { id: 2, waktu: "2026-02-08 13:45:22", user: "Budi Santoso", role: "Sekretaris", aksi: "Edit", modul: "Kegiatan", detail: "Mengubah jadwal kajian rutin", ip: "192.168.1.101" },
  { id: 3, waktu: "2026-02-08 11:20:08", user: "Admin", role: "Super Admin", aksi: "Hapus", modul: "Artikel", detail: "Menghapus artikel draft lama", ip: "192.168.1.1" },
  { id: 4, waktu: "2026-02-08 10:15:45", user: "Hasan", role: "Ketua DKM", aksi: "Approve", modul: "Sewa", detail: "Menyetujui sewa aula PT ABC", ip: "192.168.1.102" },
  { id: 5, waktu: "2026-02-07 16:30:12", user: "Ahmad Fauzi", role: "Bendahara", aksi: "Tambah", modul: "Keuangan", detail: "Menambah pengeluaran listrik Rp 850.000", ip: "192.168.1.100" },
  { id: 6, waktu: "2026-02-07 14:22:33", user: "Dewi", role: "Admin Konten", aksi: "Publish", modul: "Artikel", detail: "Mempublikasikan artikel Keutamaan Sholat", ip: "192.168.1.103" },
  { id: 7, waktu: "2026-02-07 09:10:55", user: "Admin", role: "Super Admin", aksi: "Edit", modul: "User", detail: "Mengubah role user Dewi", ip: "192.168.1.1" },
  { id: 8, waktu: "2026-02-06 15:45:20", user: "Budi Santoso", role: "Sekretaris", aksi: "Tambah", modul: "Ruangan", detail: "Menambah ruangan kelas baru", ip: "192.168.1.101" },
];

const modulOptions = ["Semua", "Keuangan", "Kegiatan", "Artikel", "Postingan", "Sewa", "Ruangan", "Fasilitas", "User", "Profil"];
const aksiOptions = ["Semua", "Tambah", "Edit", "Hapus", "Approve", "Reject", "Publish", "Login", "Logout"];

const AuditTrail = () => {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [filterModul, setFilterModul] = useState("Semua");
  const [filterAksi, setFilterAksi] = useState("Semua");

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase());
    const matchModul = filterModul === "Semua" || log.modul === filterModul;
    const matchAksi = filterAksi === "Semua" || log.aksi === filterAksi;
    return matchSearch && matchModul && matchAksi;
  });

  const getModulIcon = (modul: string) => {
    const icons: Record<string, typeof FileText> = {
      Keuangan: Wallet,
      Kegiatan: Clock,
      Artikel: FileText,
      Sewa: DoorOpen,
      User: User,
    };
    const Icon = icons[modul] || Settings;
    return <Icon className="h-3 w-3" />;
  };

  const getAksiBadge = (aksi: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      Tambah: "default",
      Edit: "secondary",
      Hapus: "destructive",
      Approve: "default",
      Reject: "destructive",
      Publish: "default",
      Login: "outline",
      Logout: "outline",
    };
    return <Badge variant={variants[aksi] || "secondary"}>{aksi}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" />
          Audit Trail
        </h1>
        <p className="text-muted-foreground">Log aktivitas pengguna, waktu, dan perubahan data</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari user atau aktivitas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Modul</Label>
                <Select value={filterModul} onValueChange={setFilterModul}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modulOptions.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Aksi</Label>
                <Select value={filterAksi} onValueChange={setFilterAksi}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {aksiOptions.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Modul</TableHead>
                <TableHead>Detail</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {log.waktu}
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.role}</Badge>
                  </TableCell>
                  <TableCell>{getAksiBadge(log.aksi)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      {getModulIcon(log.modul)}
                      {log.modul}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.detail}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
