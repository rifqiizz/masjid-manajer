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
import { FileText, Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: number;
  judul: string;
  kategori: string;
  status: "draft" | "published";
  penulis: string;
  tanggal: string;
  ringkasan: string;
}

const initialArticles: Article[] = [
  { id: 1, judul: "Keutamaan Sholat Berjamaah", kategori: "Ibadah", status: "published", penulis: "Ust. Ahmad", tanggal: "2026-02-01", ringkasan: "Artikel tentang keutamaan sholat berjamaah di masjid..." },
  { id: 2, judul: "Panduan Zakat Fitrah 2026", kategori: "Zakat", status: "published", penulis: "Bendahara", tanggal: "2026-01-28", ringkasan: "Panduan lengkap pembayaran zakat fitrah tahun ini..." },
  { id: 3, judul: "Jadwal Ramadhan 1447 H", kategori: "Pengumuman", status: "draft", penulis: "Sekretaris", tanggal: "2026-02-05", ringkasan: "Persiapan jadwal kegiatan bulan Ramadhan..." },
];

const categories = ["Ibadah", "Zakat", "Pengumuman", "Kajian", "Sosial", "Lainnya"];

const Artikel = () => {
  const { toast } = useToast();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    ringkasan: "",
    konten: "",
  });

  const filteredArticles = articles.filter(
    (a) =>
      a.judul.toLowerCase().includes(search.toLowerCase()) ||
      a.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (asDraft: boolean) => {
    if (selectedArticle) {
      setArticles(articles.map((a) =>
        a.id === selectedArticle.id
          ? { ...a, ...formData, status: asDraft ? "draft" : "published" }
          : a
      ));
      toast({ title: "Artikel diperbarui" });
    } else {
      const newArticle: Article = {
        id: Date.now(),
        judul: formData.judul,
        kategori: formData.kategori,
        status: asDraft ? "draft" : "published",
        penulis: "Admin",
        tanggal: new Date().toISOString().split("T")[0],
        ringkasan: formData.ringkasan,
      };
      setArticles([newArticle, ...articles]);
      toast({ title: asDraft ? "Draft disimpan" : "Artikel dipublikasikan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      judul: article.judul,
      kategori: article.kategori,
      ringkasan: article.ringkasan,
      konten: "",
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id));
    toast({ title: "Artikel dihapus", variant: "destructive" });
  };

  const handlePreview = (article: Article) => {
    setSelectedArticle(article);
    setPreviewOpen(true);
  };

  const resetForm = () => {
    setSelectedArticle(null);
    setFormData({ judul: "", kategori: "", ringkasan: "", konten: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-500" />
            Manajemen Artikel
          </h1>
          <p className="text-muted-foreground">Buat, edit, dan publikasikan artikel masjid</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Artikel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedArticle ? "Edit Artikel" : "Tambah Artikel Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Artikel</Label>
                <Input
                  id="judul"
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  placeholder="Masukkan judul artikel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={formData.kategori} onValueChange={(v) => setFormData({ ...formData, kategori: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ringkasan">Ringkasan</Label>
                <Textarea
                  id="ringkasan"
                  value={formData.ringkasan}
                  onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                  placeholder="Ringkasan singkat artikel"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="konten">Konten Artikel</Label>
                <Textarea
                  id="konten"
                  value={formData.konten}
                  onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                  placeholder="Tulis konten artikel lengkap..."
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => handleSave(true)}>Simpan Draft</Button>
              <Button onClick={() => handleSave(false)}>Publikasikan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
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
                <TableHead>Judul</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.judul}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{article.kategori}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.status === "published" ? "default" : "outline"}>
                      {article.status === "published" ? "Terbit" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{article.penulis}</TableCell>
                  <TableCell>{article.tanggal}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handlePreview(article)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(article)}>
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
                            <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Artikel "{article.judul}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(article.id)}>Hapus</AlertDialogAction>
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

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Preview Artikel</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="space-y-4 py-4">
              <div>
                <h2 className="text-xl font-bold">{selectedArticle.judul}</h2>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{selectedArticle.kategori}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedArticle.penulis} • {selectedArticle.tanggal}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground">{selectedArticle.ringkasan}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Artikel;
