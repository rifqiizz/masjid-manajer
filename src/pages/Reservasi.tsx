import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CalendarCheck, Plus, Pencil, Trash2, Search, Check, X, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reservasi {
  id: number;
  penyewa: string;
  telepon: string;
  ruangan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  status: "pending" | "disetujui" | "ditolak" | "selesai";
  catatan: string;
  totalBiaya: number;
}

const initialReservasi: Reservasi[] = [
  { id: 1, penyewa: "PT ABC Indonesia", telepon: "081234567890", ruangan: "Aula Utama", tanggalMulai: "2026-02-15", tanggalSelesai: "2026-02-15", waktuMulai: "08:00", waktuSelesai: "17:00", keperluan: "Seminar Perusahaan", status: "pending", catatan: "", totalBiaya: 2500000 },
  { id: 2, penyewa: "Yayasan Pendidikan XYZ", telepon: "081298765432", ruangan: "Ruang Kelas 1", tanggalMulai: "2026-02-20", tanggalSelesai: "2026-02-22", waktuMulai: "09:00", waktuSelesai: "15:00", keperluan: "Pelatihan Guru", status: "disetujui", catatan: "Sudah DP 50%", totalBiaya: 900000 },
  { id: 3, penyewa: "Komunitas Pemuda", telepon: "085678901234", ruangan: "Aula Utama", tanggalMulai: "2026-02-10", tanggalSelesai: "2026-02-10", waktuMulai: "19:00", waktuSelesai: "22:00", keperluan: "Acara Kebersamaan", status: "ditolak", catatan: "Bentrok dengan kajian rutin", totalBiaya: 2500000 },
];

const ruanganOptions = ["Aula Utama", "Ruang Rapat", "Ruang Kelas 1", "Ruang Kelas 2"];

const ReservasiPage = () => {
  const { toast } = useToast();
  const [reservasi, setReservasi] = useState<Reservasi[]>(initialReservasi);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedReservasi, setSelectedReservasi] = useState<Reservasi | null>(null);
  const [formData, setFormData] = useState({
    penyewa: "",
    telepon: "",
    ruangan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    waktuMulai: "",
    waktuSelesai: "",
    keperluan: "",
    catatan: "",
    totalBiaya: 0,
  });

  const filteredReservasi = reservasi.filter(
    (s) =>
      s.penyewa.toLowerCase().includes(search.toLowerCase()) ||
      s.ruangan.toLowerCase().includes(search.toLowerCase())
  );

  const checkConflict = (newReservasi: typeof formData, excludeId?: number) => {
    return reservasi.some((s) => {
      if (excludeId && s.id === excludeId) return false;
      if (s.status === "ditolak") return false;
      if (s.ruangan !== newReservasi.ruangan) return false;
      
      const newStart = new Date(`${newReservasi.tanggalMulai}T${newReservasi.waktuMulai}`);
      const newEnd = new Date(`${newReservasi.tanggalSelesai}T${newReservasi.waktuSelesai}`);
      const existStart = new Date(`${s.tanggalMulai}T${s.waktuMulai}`);
      const existEnd = new Date(`${s.tanggalSelesai}T${s.waktuSelesai}`);
      
      return (newStart < existEnd && newEnd > existStart);
    });
  };

  const handleSave = () => {
    const hasConflict = checkConflict(formData, selectedReservasi?.id);
    if (hasConflict) {
      toast({ title: "Jadwal bentrok!", description: "Ruangan sudah dipesan pada waktu tersebut", variant: "destructive" });
      return;
    }

    if (selectedReservasi) {
      setReservasi(reservasi.map((s) =>
        s.id === selectedReservasi.id ? { ...s, ...formData, status: s.status } : s
      ));
      toast({ title: "Data reservasi diperbarui" });
    } else {
      const newReservasi: Reservasi = {
        id: Date.now(),
        ...formData,
        status: "pending",
      };
      setReservasi([newReservasi, ...reservasi]);
      toast({ title: "Permohonan reservasi ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleApprove = (id: number) => {
    setReservasi(reservasi.map((s) => s.id === id ? { ...s, status: "disetujui" } : s));
    toast({ title: "Reservasi disetujui" });
  };

  const handleReject = (id: number, catatan: string) => {
    setReservasi(reservasi.map((s) => s.id === id ? { ...s, status: "ditolak", catatan } : s));
    toast({ title: "Reservasi ditolak", variant: "destructive" });
  };

  const handleEdit = (s: Reservasi) => {
    setSelectedReservasi(s);
    setFormData({
      penyewa: s.penyewa,
      telepon: s.telepon,
      ruangan: s.ruangan,
      tanggalMulai: s.tanggalMulai,
      tanggalSelesai: s.tanggalSelesai,
      waktuMulai: s.waktuMulai,
      waktuSelesai: s.waktuSelesai,
      keperluan: s.keperluan,
      catatan: s.catatan,
      totalBiaya: s.totalBiaya,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setReservasi(reservasi.filter((s) => s.id !== id));
    toast({ title: "Data reservasi dihapus", variant: "destructive" });
  };

  const resetForm = () => {
    setSelectedReservasi(null);
    setFormData({
      penyewa: "",
      telepon: "",
      ruangan: "",
      tanggalMulai: "",
      tanggalSelesai: "",
      waktuMulai: "",
      waktuSelesai: "",
      keperluan: "",
      catatan: "",
      totalBiaya: 0,
    });
  };

  const getStatusBadge = (status: Reservasi["status"]) => {
    const config = {
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock },
      disetujui: { variant: "default" as const, label: "Disetujui", icon: Check },
      ditolak: { variant: "destructive" as const, label: "Ditolak", icon: X },
      selesai: { variant: "outline" as const, label: "Selesai", icon: Check },
    };
    const Icon = config[status].icon;
    return (
      <Badge variant={config[status].variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config[status].label}
      </Badge>
    );
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const pendingCount = reservasi.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-yellow-500" />
            Manajemen Reservasi
          </h1>
          <p className="text-muted-foreground">Approval, kalender booking, dan deteksi bentrok jadwal</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Reservasi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedReservasi ? "Edit Data Reservasi" : "Tambah Permohonan Reservasi"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="penyewa">Nama Penyewa</Label>
                <Input
                  id="penyewa"
                  value={formData.penyewa}
                  onChange={(e) => setFormData({ ...formData, penyewa: e.target.value })}
                  placeholder="Nama penyewa / organisasi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telepon">No. Telepon/WA</Label>
                <Input
                  id="telepon"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  placeholder="081234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ruangan">Ruangan</Label>
                <Select value={formData.ruangan} onValueChange={(v) => setFormData({ ...formData, ruangan: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ruangan" />
                  </SelectTrigger>
                  <SelectContent>
                    {ruanganOptions.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tglMulai">Tanggal Mulai</Label>
                  <Input
                    id="tglMulai"
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tglSelesai">Tanggal Selesai</Label>
                  <Input
                    id="tglSelesai"
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waktuMulai">Waktu Mulai</Label>
                  <Input
                    id="waktuMulai"
                    type="time"
                    value={formData.waktuMulai}
                    onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waktuSelesai">Waktu Selesai</Label>
                  <Input
                    id="waktuSelesai"
                    type="time"
                    value={formData.waktuSelesai}
                    onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="keperluan">Keperluan</Label>
                <Input
                  id="keperluan"
                  value={formData.keperluan}
                  onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                  placeholder="Keperluan penyewaan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="biaya">Total Biaya (Rp)</Label>
                <Input
                  id="biaya"
                  type="number"
                  value={formData.totalBiaya}
                  onChange={(e) => setFormData({ ...formData, totalBiaya: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan Internal</Label>
                <Textarea
                  id="catatan"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  placeholder="Catatan tambahan..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {pendingCount > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">{pendingCount} permohonan reservasi menunggu persetujuan</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari penyewa atau ruangan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Penyewa</TableHead>
                <TableHead>Ruangan</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Biaya</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReservasi.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{s.penyewa}</p>
                      <p className="text-xs text-muted-foreground">{s.telepon}</p>
                    </div>
                  </TableCell>
                  <TableCell>{s.ruangan}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{s.tanggalMulai}</p>
                      <p className="text-muted-foreground">{s.waktuMulai} - {s.waktuSelesai}</p>
                    </div>
                  </TableCell>
                  <TableCell>{s.keperluan}</TableCell>
                  <TableCell>{formatRupiah(s.totalBiaya)}</TableCell>
                  <TableCell>{getStatusBadge(s.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {s.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleApprove(s.id)} title="Setujui">
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Tolak">
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Tolak Permohonan?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Permohonan dari "{s.penyewa}" akan ditolak.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleReject(s.id, "Ditolak oleh admin")}>Tolak</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Data Reservasi?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Data reservasi "{s.penyewa}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(s.id)}>Hapus</AlertDialogAction>
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
    </div>
  );
};

export default ReservasiPage;
