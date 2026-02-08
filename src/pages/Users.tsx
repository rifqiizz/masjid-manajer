import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UserCog, Plus, Pencil, Trash2, Search, Shield, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  nama: string;
  email: string;
  role: "super_admin" | "ketua_dkm" | "sekretaris" | "bendahara" | "admin_konten";
  aktif: boolean;
  lastLogin: string;
}

const initialUsers: User[] = [
  { id: 1, nama: "Admin Utama", email: "admin@masjid.or.id", role: "super_admin", aktif: true, lastLogin: "2026-02-08 14:30" },
  { id: 2, nama: "H. Muhammad Hasan", email: "ketua@masjid.or.id", role: "ketua_dkm", aktif: true, lastLogin: "2026-02-08 10:15" },
  { id: 3, nama: "Budi Santoso", email: "sekretaris@masjid.or.id", role: "sekretaris", aktif: true, lastLogin: "2026-02-07 16:45" },
  { id: 4, nama: "Ahmad Fauzi", email: "bendahara@masjid.or.id", role: "bendahara", aktif: true, lastLogin: "2026-02-08 11:20" },
  { id: 5, nama: "Dewi Rahmawati", email: "konten@masjid.or.id", role: "admin_konten", aktif: true, lastLogin: "2026-02-06 09:30" },
  { id: 6, nama: "Rudi Hartono", email: "rudi@masjid.or.id", role: "admin_konten", aktif: false, lastLogin: "2026-01-15 14:00" },
];

const roleOptions = [
  { value: "super_admin", label: "Super Admin", color: "text-red-600" },
  { value: "ketua_dkm", label: "Ketua DKM", color: "text-purple-600" },
  { value: "sekretaris", label: "Sekretaris", color: "text-blue-600" },
  { value: "bendahara", label: "Bendahara", color: "text-green-600" },
  { value: "admin_konten", label: "Admin Konten", color: "text-orange-600" },
];

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "admin_konten" as User["role"],
    aktif: true,
    password: "",
  });

  const filteredUsers = users.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (selectedUser) {
      setUsers(users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, nama: formData.nama, email: formData.email, role: formData.role, aktif: formData.aktif }
          : u
      ));
      toast({ title: "User diperbarui" });
    } else {
      const newUser: User = {
        id: Date.now(),
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
        aktif: formData.aktif,
        lastLogin: "-",
      };
      setUsers([newUser, ...users]);
      toast({ title: "User ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (u: User) => {
    setSelectedUser(u);
    setFormData({
      nama: u.nama,
      email: u.email,
      role: u.role,
      aktif: u.aktif,
      password: "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
    toast({ title: "User dihapus", variant: "destructive" });
  };

  const handleToggleActive = (id: number) => {
    setUsers(users.map((u) => u.id === id ? { ...u, aktif: !u.aktif } : u));
    toast({ title: "Status user diperbarui" });
  };

  const handleResetPassword = (u: User) => {
    setSelectedUser(u);
    setResetPasswordOpen(true);
  };

  const confirmResetPassword = () => {
    toast({ title: `Password untuk ${selectedUser?.email} telah direset` });
    setResetPasswordOpen(false);
    setSelectedUser(null);
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormData({
      nama: "",
      email: "",
      role: "admin_konten",
      aktif: true,
      password: "",
    });
  };

  const getRoleBadge = (role: User["role"]) => {
    const config = roleOptions.find((r) => r.value === role);
    return (
      <Badge variant="outline" className={config?.color}>
        <Shield className="h-3 w-3 mr-1" />
        {config?.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="h-6 w-6 text-rose-500" />
            Manajemen User
          </h1>
          <p className="text-muted-foreground">Kelola akun pengguna sistem (hanya dikelola oleh admin)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedUser ? "Edit User" : "Tambah User Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@masjid.or.id"
                />
              </div>
              {!selectedUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password Awal</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password untuk login"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as User["role"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="aktif">Status Aktif</Label>
                <Switch
                  id="aktif"
                  checked={formData.aktif}
                  onCheckedChange={(checked) => setFormData({ ...formData, aktif: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info */}
      <Card className="border-blue-500/50 bg-blue-50/50">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-700">
            <strong>Catatan:</strong> Tidak ada pendaftaran publik. Semua user hanya bisa ditambahkan oleh admin melalui halaman ini.
          </p>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.nama}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{getRoleBadge(u.role)}</TableCell>
                  <TableCell>
                    <Badge variant={u.aktif ? "default" : "secondary"}>
                      {u.aktif ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResetPassword(u)}
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4 text-yellow-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(u)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={u.role === "super_admin" && users.filter((x) => x.role === "super_admin").length === 1}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                            <AlertDialogDescription>
                              User "{u.nama}" akan dihapus permanen dan tidak bisa login lagi.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(u.id)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <AlertDialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password?</AlertDialogTitle>
            <AlertDialogDescription>
              Password untuk "{selectedUser?.email}" akan direset. User akan menerima password baru via email.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetPassword}>Reset Password</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
