import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Plus, Pencil, Trash2, Search, Phone, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Jamaah {
  id: number;
  nama: string;
  noWa: string;
  kategori: "jamaah" | "pengurus" | "penyewa" | "donatur" | "ustadz";
  alamat: string;
  catatan: string;
  tanggalDaftar: string;
}

const initialJamaah: Jamaah[] = [
  { id: 1, nama: "H. Ahmad Fauzi", noWa: "081234567890", kategori: "pengurus", alamat: "Jl. Mawar No. 10", catatan: "Bendahara DKM", tanggalDaftar: "2024-01-15" },
  { id: 2, nama: "Budi Santoso", noWa: "081298765432", kategori: "pengurus", alamat: "Jl. Melati No. 5", catatan: "Sekretaris DKM", tanggalDaftar: "2024-01-15" },
  { id: 3, nama: "Ust. Muhammad Hasan", noWa: "085678901234", kategori: "ustadz", alamat: "Jl. Anggrek No. 20", catatan: "Pengisi kajian rutin Ahad", tanggalDaftar: "2024-02-01" },
  { id: 4, nama: "PT ABC Indonesia", noWa: "081345678901", kategori: "penyewa", alamat: "Gedung ABC Lt. 5", catatan: "Penyewa aula reguler", tanggalDaftar: "2025-06-10" },
  { id: 5, nama: "Ibu Siti Aminah", noWa: "082123456789", kategori: "donatur", alamat: "Jl. Dahlia No. 8", catatan: "Donatur tetap bulanan", tanggalDaftar: "2024-03-20" },
  { id: 6, nama: "Pak Joko", noWa: "081567890123", kategori: "jamaah", alamat: "Jl. Kenanga No. 15", catatan: "", tanggalDaftar: "2025-01-10" },
];

const kategoriOptions = [
  { value: "jamaah", label: "Jamaah" },
  { value: "pengurus", label: "Pengurus" },
  { value: "penyewa", label: "Penyewa" },
  { value: "donatur", label: "Donatur" },
  { value: "ustadz", label: "Ustadz/Penceramah" },
];

const Jamaah = () => {
  const { toast } = useToast();
  const [jamaah, setJamaah] = useState<Jamaah[]>(initialJamaah);
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("semua");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedJamaah, setSelectedJamaah] = useState<Jamaah | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    noWa: "",
    kategori: "jamaah" as Jamaah["kategori"],
    alamat: "",
    catatan: "",
  });

  const filteredJamaah = jamaah.filter((j) => {
    const matchSearch =
      j.nama.toLowerCase().includes(search.toLowerCase()) ||
      j.noWa.includes(search);
    const matchKategori = filterKategori === "semua" || j.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const handleSave = () => {
    if (selectedJamaah) {
      setJamaah(jamaah.map((j) =>
        j.id === selectedJamaah.id ? { ...j, ...formData } : j
      ));
      toast({ title: "Data jamaah diperbarui" });
    } else {
      const newJamaah: Jamaah = {
        id: Date.now(),
        ...formData,
        tanggalDaftar: new Date().toISOString().split("T")[0],
      };
      setJamaah([newJamaah, ...jamaah]);
      toast({ title: "Jamaah ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (j: Jamaah) => {
    setSelectedJamaah(j);
    setFormData({
      nama: j.nama,
      noWa: j.noWa,
      kategori: j.kategori,
      alamat: j.alamat,
      catatan: j.catatan,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setJamaah(jamaah.filter((j) => j.id !== id));
    toast({ title: "Data jamaah dihapus", variant: "destructive" });
  };

  const handleWhatsApp = (noWa: string) => {
    const formatted = noWa.replace(/^0/, "62");
    window.open(`https://wa.me/${formatted}`, "_blank");
  };

  const resetForm = () => {
    setSelectedJamaah(null);
    setFormData({
      nama: "",
      noWa: "",
      kategori: "jamaah",
      alamat: "",
      catatan: "",
    });
  };

  const getKategoriBadge = (kategori: Jamaah["kategori"]) => {
    const config = {
      jamaah: { variant: "secondary" as const, label: "Jamaah" },
      pengurus: { variant: "default" as const, label: "Pengurus" },
      penyewa: { variant: "outline" as const, label: "Penyewa" },
      donatur: { variant: "default" as const, label: "Donatur" },
      ustadz: { variant: "default" as const, label: "Ustadz" },
    };
    return <Badge variant={config[kategori].variant}>{config[kategori].label}</Badge>;
  };

  const stats = {
    total: jamaah.length,
    pengurus: jamaah.filter((j) => j.kategori === "pengurus").length,
    penyewa: jamaah.filter((j) => j.kategori === "penyewa").length,
    donatur: jamaah.filter((j) => j.kategori === "donatur").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-500" />
            Manajemen Jamaah
          </h1>
          <p className="text-muted-foreground">Data jamaah, pengurus, penyewa, dan stakeholder lainnya</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedJamaah ? "Edit Data" : "Tambah Data Baru"}</DialogTitle>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noWa">Nomor WhatsApp</Label>
                  <Input
                    id="noWa"
                    value={formData.noWa}
                    onChange={(e) => setFormData({ ...formData, noWa: e.target.value })}
                    placeholder="081234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Select value={formData.kategori} onValueChange={(v) => setFormData({ ...formData, kategori: v as Jamaah["kategori"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriOptions.map((k) => (
                        <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan</Label>
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Data</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{stats.pengurus}</div>
            <p className="text-sm text-muted-foreground">Pengurus</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.penyewa}</div>
            <p className="text-sm text-muted-foreground">Penyewa</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.donatur}</div>
            <p className="text-sm text-muted-foreground">Donatur</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau nomor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterKategori} onValueChange={setFilterKategori}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kategori</SelectItem>
                {kategoriOptions.map((k) => (
                  <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <TableHead>No. WhatsApp</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Catatan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJamaah.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.nama}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {j.noWa}
                    </div>
                  </TableCell>
                  <TableCell>{getKategoriBadge(j.kategori)}</TableCell>
                  <TableCell className="max-w-[150px] truncate">{j.alamat}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-muted-foreground">{j.catatan}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleWhatsApp(j.noWa)}
                        title="Hubungi via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(j)}>
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
                            <AlertDialogTitle>Hapus Data?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Data "{j.nama}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(j.id)}>Hapus</AlertDialogAction>
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

export default Jamaah;
