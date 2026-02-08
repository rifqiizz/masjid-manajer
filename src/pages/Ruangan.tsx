import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DoorOpen, Plus, Pencil, Trash2, Search, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ruangan {
  id: number;
  nama: string;
  kapasitas: number;
  hargaSewa: number;
  tersediaUntukSewa: boolean;
  aturan: string;
  fasilitas: string;
}

const initialRuangan: Ruangan[] = [
  { id: 1, nama: "Aula Utama", kapasitas: 500, hargaSewa: 2500000, tersediaUntukSewa: true, aturan: "Tidak boleh merokok, maksimal sampai jam 22:00", fasilitas: "AC, Sound System, Proyektor, Kursi" },
  { id: 2, nama: "Ruang Rapat", kapasitas: 30, hargaSewa: 500000, tersediaUntukSewa: true, aturan: "Hanya untuk rapat internal", fasilitas: "AC, Meja, Kursi, Whiteboard" },
  { id: 3, nama: "Ruang Kelas 1", kapasitas: 40, hargaSewa: 300000, tersediaUntukSewa: true, aturan: "Untuk kegiatan edukasi", fasilitas: "AC, Meja Kursi, Papan Tulis" },
  { id: 4, nama: "Ruang Kelas 2", kapasitas: 40, hargaSewa: 300000, tersediaUntukSewa: false, aturan: "Untuk kegiatan edukasi", fasilitas: "AC, Meja Kursi, Papan Tulis" },
];

const Ruangan = () => {
  const { toast } = useToast();
  const [ruangan, setRuangan] = useState<Ruangan[]>(initialRuangan);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRuangan, setSelectedRuangan] = useState<Ruangan | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    kapasitas: 0,
    hargaSewa: 0,
    tersediaUntukSewa: true,
    aturan: "",
    fasilitas: "",
  });

  const filteredRuangan = ruangan.filter(
    (r) => r.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (selectedRuangan) {
      setRuangan(ruangan.map((r) =>
        r.id === selectedRuangan.id ? { ...r, ...formData } : r
      ));
      toast({ title: "Ruangan diperbarui" });
    } else {
      const newRuangan: Ruangan = {
        id: Date.now(),
        ...formData,
      };
      setRuangan([newRuangan, ...ruangan]);
      toast({ title: "Ruangan ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (r: Ruangan) => {
    setSelectedRuangan(r);
    setFormData({
      nama: r.nama,
      kapasitas: r.kapasitas,
      hargaSewa: r.hargaSewa,
      tersediaUntukSewa: r.tersediaUntukSewa,
      aturan: r.aturan,
      fasilitas: r.fasilitas,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setRuangan(ruangan.filter((r) => r.id !== id));
    toast({ title: "Ruangan dihapus", variant: "destructive" });
  };

  const resetForm = () => {
    setSelectedRuangan(null);
    setFormData({
      nama: "",
      kapasitas: 0,
      hargaSewa: 0,
      tersediaUntukSewa: true,
      aturan: "",
      fasilitas: "",
    });
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DoorOpen className="h-6 w-6 text-cyan-500" />
            Manajemen Ruangan
          </h1>
          <p className="text-muted-foreground">Data ruangan, kapasitas, harga sewa, dan aturan penggunaan</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Ruangan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedRuangan ? "Edit Ruangan" : "Tambah Ruangan Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Ruangan</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama ruangan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kapasitas">Kapasitas (orang)</Label>
                  <Input
                    id="kapasitas"
                    type="number"
                    value={formData.kapasitas}
                    onChange={(e) => setFormData({ ...formData, kapasitas: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harga">Harga Sewa (Rp)</Label>
                  <Input
                    id="harga"
                    type="number"
                    value={formData.hargaSewa}
                    onChange={(e) => setFormData({ ...formData, hargaSewa: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="tersedia">Tersedia untuk Disewa</Label>
                <Switch
                  id="tersedia"
                  checked={formData.tersediaUntukSewa}
                  onCheckedChange={(checked) => setFormData({ ...formData, tersediaUntukSewa: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fasilitas">Fasilitas</Label>
                <Input
                  id="fasilitas"
                  value={formData.fasilitas}
                  onChange={(e) => setFormData({ ...formData, fasilitas: e.target.value })}
                  placeholder="AC, Sound System, dll"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aturan">Aturan Penggunaan</Label>
                <Textarea
                  id="aturan"
                  value={formData.aturan}
                  onChange={(e) => setFormData({ ...formData, aturan: e.target.value })}
                  placeholder="Aturan penggunaan ruangan..."
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

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari ruangan..."
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
                <TableHead>Nama Ruangan</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Harga Sewa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fasilitas</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRuangan.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nama}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {r.kapasitas} orang
                    </div>
                  </TableCell>
                  <TableCell>{formatRupiah(r.hargaSewa)}</TableCell>
                  <TableCell>
                    <Badge variant={r.tersediaUntukSewa ? "default" : "secondary"}>
                      {r.tersediaUntukSewa ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{r.fasilitas}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(r)}>
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
                            <AlertDialogTitle>Hapus Ruangan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ruangan "{r.nama}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(r.id)}>Hapus</AlertDialogAction>
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

export default Ruangan;
