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
import { Megaphone, Plus, Pencil, Trash2, Search, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Postingan {
  id: number;
  judul: string;
  jenis: string;
  status: "aktif" | "terjadwal" | "berakhir";
  tanggalMulai: string;
  tanggalAkhir: string;
  isi: string;
}

const initialPosts: Postingan[] = [
  { id: 1, judul: "Pengumuman Sholat Jumat", jenis: "Pengumuman", status: "aktif", tanggalMulai: "2026-02-01", tanggalAkhir: "2026-02-28", isi: "Sholat Jumat dimulai pukul 12:00 WIB" },
  { id: 2, judul: "Pendaftaran Pesantren Kilat", jenis: "Info Kegiatan", status: "terjadwal", tanggalMulai: "2026-03-01", tanggalAkhir: "2026-03-15", isi: "Pendaftaran pesantren kilat dibuka!" },
  { id: 3, judul: "Libur Tahun Baru", jenis: "Pengumuman", status: "berakhir", tanggalMulai: "2026-01-01", tanggalAkhir: "2026-01-02", isi: "Sekretariat tutup tanggal 1-2 Januari" },
];

const jenisOptions = ["Pengumuman", "Info Kegiatan", "Peringatan", "Himbauan", "Lainnya"];

const Postingan = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Postingan[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Postingan | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    jenis: "",
    tanggalMulai: "",
    tanggalAkhir: "",
    isi: "",
  });

  const filteredPosts = posts.filter(
    (p) =>
      p.judul.toLowerCase().includes(search.toLowerCase()) ||
      p.jenis.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusFromDates = (mulai: string, akhir: string): "aktif" | "terjadwal" | "berakhir" => {
    const today = new Date().toISOString().split("T")[0];
    if (today < mulai) return "terjadwal";
    if (today > akhir) return "berakhir";
    return "aktif";
  };

  const handleSave = () => {
    const status = getStatusFromDates(formData.tanggalMulai, formData.tanggalAkhir);
    if (selectedPost) {
      setPosts(posts.map((p) =>
        p.id === selectedPost.id
          ? { ...p, ...formData, status }
          : p
      ));
      toast({ title: "Postingan diperbarui" });
    } else {
      const newPost: Postingan = {
        id: Date.now(),
        ...formData,
        status,
      };
      setPosts([newPost, ...posts]);
      toast({ title: "Postingan ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (post: Postingan) => {
    setSelectedPost(post);
    setFormData({
      judul: post.judul,
      jenis: post.jenis,
      tanggalMulai: post.tanggalMulai,
      tanggalAkhir: post.tanggalAkhir,
      isi: post.isi,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
    toast({ title: "Postingan dihapus", variant: "destructive" });
  };

  const resetForm = () => {
    setSelectedPost(null);
    setFormData({ judul: "", jenis: "", tanggalMulai: "", tanggalAkhir: "", isi: "" });
  };

  const getStatusBadge = (status: Postingan["status"]) => {
    const variants = {
      aktif: "default",
      terjadwal: "secondary",
      berakhir: "outline",
    } as const;
    const labels = { aktif: "Aktif", terjadwal: "Terjadwal", berakhir: "Berakhir" };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-orange-500" />
            Manajemen Postingan
          </h1>
          <p className="text-muted-foreground">Kelola pengumuman dan jadwal tayang</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Postingan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedPost ? "Edit Postingan" : "Tambah Postingan Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul</Label>
                <Input
                  id="judul"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Judul postingan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jenis">Jenis</Label>
                <Select value={formData.jenis} onValueChange={(v) => setFormData({ ...formData, jenis: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisOptions.map((j) => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mulai">Tanggal Mulai</Label>
                  <Input
                    id="mulai"
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="akhir">Tanggal Akhir</Label>
                  <Input
                    id="akhir"
                    type="date"
                    value={formData.tanggalAkhir}
                    onChange={(e) => setFormData({ ...formData, tanggalAkhir: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isi">Isi Postingan</Label>
                <Textarea
                  id="isi"
                  value={formData.isi}
                  onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                  placeholder="Isi pengumuman atau postingan..."
                  rows={4}
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
              placeholder="Cari postingan..."
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
                <TableHead>Judul</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Periode Tayang</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.judul}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.jenis}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {post.tanggalMulai} s/d {post.tanggalAkhir}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
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
                            <AlertDialogTitle>Hapus Postingan?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Postingan "{post.judul}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(post.id)}>Hapus</AlertDialogAction>
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

export default Postingan;
