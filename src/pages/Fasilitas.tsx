import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Wrench, Plus, Pencil, Trash2, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import fasilitasHero from "@/assets/fasilitas-hero.jpg";

interface Fasilitas {
  id: number;
  nama: string;
  kategori: string;
  lokasi: string;
  kondisi: "baik" | "rusak_ringan" | "rusak_berat" | "dalam_perbaikan";
  aktif: boolean;
  tanggalPerawatan: string;
  catatanPerawatan: string;
}

const initialFasilitas: Fasilitas[] = [
  { id: 1, nama: "AC Aula Utama", kategori: "Pendingin", lokasi: "Aula Utama", kondisi: "baik", aktif: true, tanggalPerawatan: "2026-01-15", catatanPerawatan: "Service rutin" },
  { id: 2, nama: "Sound System", kategori: "Audio", lokasi: "Aula Utama", kondisi: "baik", aktif: true, tanggalPerawatan: "2026-01-20", catatanPerawatan: "Cek kabel dan mixer" },
  { id: 3, nama: "Proyektor Epson", kategori: "Visual", lokasi: "Ruang Rapat", kondisi: "rusak_ringan", aktif: true, tanggalPerawatan: "2026-02-01", catatanPerawatan: "Lampu agak redup, perlu ganti" },
  { id: 4, nama: "Pompa Air", kategori: "Utilitas", lokasi: "Basement", kondisi: "dalam_perbaikan", aktif: false, tanggalPerawatan: "2026-02-05", catatanPerawatan: "Sedang diperbaiki teknisi" },
];

const kategoriOptions = ["Pendingin", "Audio", "Visual", "Utilitas", "Elektronik", "Furniture", "Lainnya"];
const kondisiOptions = [
  { value: "baik", label: "Baik" },
  { value: "rusak_ringan", label: "Rusak Ringan" },
  { value: "rusak_berat", label: "Rusak Berat" },
  { value: "dalam_perbaikan", label: "Dalam Perbaikan" },
];

const FasilitasPage = () => {
  const { toast } = useToast();
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>(initialFasilitas);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFasilitas, setSelectedFasilitas] = useState<Fasilitas | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    lokasi: "",
    kondisi: "baik" as Fasilitas["kondisi"],
    aktif: true,
    tanggalPerawatan: "",
    catatanPerawatan: "",
  });

  const filteredFasilitas = fasilitas.filter(
    (f) =>
      f.nama.toLowerCase().includes(search.toLowerCase()) ||
      f.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (selectedFasilitas) {
      setFasilitas(fasilitas.map((f) =>
        f.id === selectedFasilitas.id ? { ...f, ...formData } : f
      ));
      toast({ title: "Fasilitas diperbarui" });
    } else {
      const newFasilitas: Fasilitas = {
        id: Date.now(),
        ...formData,
      };
      setFasilitas([newFasilitas, ...fasilitas]);
      toast({ title: "Fasilitas ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (f: Fasilitas) => {
    setSelectedFasilitas(f);
    setFormData({
      nama: f.nama,
      kategori: f.kategori,
      lokasi: f.lokasi,
      kondisi: f.kondisi,
      aktif: f.aktif,
      tanggalPerawatan: f.tanggalPerawatan,
      catatanPerawatan: f.catatanPerawatan,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setFasilitas(fasilitas.filter((f) => f.id !== id));
    toast({ title: "Fasilitas dihapus", variant: "destructive" });
  };

  const resetForm = () => {
    setSelectedFasilitas(null);
    setFormData({
      nama: "",
      kategori: "",
      lokasi: "",
      kondisi: "baik",
      aktif: true,
      tanggalPerawatan: "",
      catatanPerawatan: "",
    });
  };

  const getKondisiBadge = (kondisi: Fasilitas["kondisi"]) => {
    const config = {
      baik: { variant: "default" as const, label: "Baik", icon: CheckCircle },
      rusak_ringan: { variant: "secondary" as const, label: "Rusak Ringan", icon: AlertTriangle },
      rusak_berat: { variant: "destructive" as const, label: "Rusak Berat", icon: AlertTriangle },
      dalam_perbaikan: { variant: "outline" as const, label: "Dalam Perbaikan", icon: Wrench },
    };
    const Icon = config[kondisi].icon;
    return (
      <Badge variant={config[kondisi].variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config[kondisi].label}
      </Badge>
    );
  };

  const needsAttention = fasilitas.filter((f) => f.kondisi !== "baik").length;

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="relative h-40 rounded-lg overflow-hidden">
        <img
          src={fasilitasHero}
          alt="Fasilitas Masjid"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex items-center">
          <div className="px-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Wrench className="h-6 w-6" />
              Manajemen Fasilitas
            </h1>
            <p className="text-white/80 text-sm mt-1">Status fasilitas aktif dan catatan perawatan</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Fasilitas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedFasilitas ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Fasilitas</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama fasilitas"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kategori">Kategori</Label>
                  <Select value={formData.kategori} onValueChange={(v) => setFormData({ ...formData, kategori: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriOptions.map((k) => (
                        <SelectItem key={k} value={k}>{k}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lokasi">Lokasi</Label>
                  <Input
                    id="lokasi"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    placeholder="Lokasi fasilitas"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kondisi">Kondisi</Label>
                  <Select value={formData.kondisi} onValueChange={(v) => setFormData({ ...formData, kondisi: v as Fasilitas["kondisi"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {kondisiOptions.map((k) => (
                        <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal Perawatan</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggalPerawatan}
                    onChange={(e) => setFormData({ ...formData, tanggalPerawatan: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="aktif">Status Aktif</Label>
                <Switch
                  id="aktif"
                  checked={formData.aktif}
                  onCheckedChange={(checked) => setFormData({ ...formData, aktif: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan Perawatan</Label>
                <Textarea
                  id="catatan"
                  value={formData.catatanPerawatan}
                  onChange={(e) => setFormData({ ...formData, catatanPerawatan: e.target.value })}
                  placeholder="Catatan perawatan terakhir..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {needsAttention > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">{needsAttention} fasilitas perlu perhatian</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari fasilitas..."
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
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Perawatan Terakhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFasilitas.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.nama}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{f.kategori}</Badge>
                  </TableCell>
                  <TableCell>{f.lokasi}</TableCell>
                  <TableCell>{getKondisiBadge(f.kondisi)}</TableCell>
                  <TableCell>
                    <Badge variant={f.aktif ? "default" : "outline"}>
                      {f.aktif ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>{f.tanggalPerawatan}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(f)}>
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
                            <AlertDialogTitle>Hapus Fasilitas?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Fasilitas "{f.nama}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(f.id)}>Hapus</AlertDialogAction>
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

export default FasilitasPage;
