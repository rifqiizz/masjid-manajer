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
import { CalendarDays, Plus, Pencil, Trash2, Search, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Kegiatan {
  id: number;
  nama: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  penanggungJawab: string;
  status: "dijadwalkan" | "berlangsung" | "selesai" | "dibatalkan";
  deskripsi: string;
}

const initialKegiatan: Kegiatan[] = [
  { id: 1, nama: "Kajian Rutin Ahad", tanggal: "2026-02-09", waktu: "08:00", lokasi: "Aula Utama", penanggungJawab: "Ust. Ahmad", status: "dijadwalkan", deskripsi: "Kajian tafsir Al-Quran" },
  { id: 2, nama: "Rapat Pengurus Bulanan", tanggal: "2026-02-12", waktu: "19:30", lokasi: "Ruang Rapat", penanggungJawab: "Ketua DKM", status: "dijadwalkan", deskripsi: "Evaluasi bulanan" },
  { id: 3, nama: "Bersih-bersih Masjid", tanggal: "2026-02-15", waktu: "07:00", lokasi: "Seluruh Masjid", penanggungJawab: "Seksi Kebersihan", status: "dijadwalkan", deskripsi: "Kerja bakti bulanan" },
  { id: 4, nama: "Santunan Anak Yatim", tanggal: "2026-02-20", waktu: "10:00", lokasi: "Aula Utama", penanggungJawab: "Bendahara", status: "dijadwalkan", deskripsi: "Santunan bulanan" },
];

const statusOptions = ["dijadwalkan", "berlangsung", "selesai", "dibatalkan"] as const;

const Kegiatan = () => {
  const { toast } = useToast();
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>(initialKegiatan);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    tanggal: "",
    waktu: "",
    lokasi: "",
    penanggungJawab: "",
    status: "dijadwalkan" as Kegiatan["status"],
    deskripsi: "",
  });

  const filteredKegiatan = kegiatan.filter(
    (k) =>
      k.nama.toLowerCase().includes(search.toLowerCase()) ||
      k.penanggungJawab.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (selectedKegiatan) {
      setKegiatan(kegiatan.map((k) =>
        k.id === selectedKegiatan.id ? { ...k, ...formData } : k
      ));
      toast({ title: "Kegiatan diperbarui" });
    } else {
      const newKegiatan: Kegiatan = {
        id: Date.now(),
        ...formData,
      };
      setKegiatan([newKegiatan, ...kegiatan]);
      toast({ title: "Kegiatan ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (k: Kegiatan) => {
    setSelectedKegiatan(k);
    setFormData({
      nama: k.nama,
      tanggal: k.tanggal,
      waktu: k.waktu,
      lokasi: k.lokasi,
      penanggungJawab: k.penanggungJawab,
      status: k.status,
      deskripsi: k.deskripsi,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setKegiatan(kegiatan.filter((k) => k.id !== id));
    toast({ title: "Kegiatan dihapus", variant: "destructive" });
  };

  const resetForm = () => {
    setSelectedKegiatan(null);
    setFormData({
      nama: "",
      tanggal: "",
      waktu: "",
      lokasi: "",
      penanggungJawab: "",
      status: "dijadwalkan",
      deskripsi: "",
    });
  };

  const getStatusBadge = (status: Kegiatan["status"]) => {
    const config = {
      dijadwalkan: { variant: "secondary" as const, label: "Dijadwalkan" },
      berlangsung: { variant: "default" as const, label: "Berlangsung" },
      selesai: { variant: "outline" as const, label: "Selesai" },
      dibatalkan: { variant: "destructive" as const, label: "Dibatalkan" },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-purple-500" />
            Manajemen Kegiatan
          </h1>
          <p className="text-muted-foreground">Jadwal kegiatan, penanggung jawab, dan status pelaksanaan</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Kegiatan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedKegiatan ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Kegiatan</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Nama kegiatan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waktu">Waktu</Label>
                  <Input
                    id="waktu"
                    type="time"
                    value={formData.waktu}
                    onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokasi">Lokasi</Label>
                <Input
                  id="lokasi"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                  placeholder="Lokasi kegiatan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pj">Penanggung Jawab</Label>
                <Input
                  id="pj"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  placeholder="Nama penanggung jawab"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as Kegiatan["status"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Deskripsi kegiatan..."
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
              placeholder="Cari kegiatan..."
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
                <TableHead>Kegiatan</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKegiatan.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.nama}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {k.tanggal} {k.waktu}
                    </div>
                  </TableCell>
                  <TableCell>{k.lokasi}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      {k.penanggungJawab}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(k.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(k)}>
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
                            <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Kegiatan "{k.nama}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(k.id)}>Hapus</AlertDialogAction>
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

export default Kegiatan;
