import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowDownCircle, Plus, Pencil, Trash2, Search, Download, FileSpreadsheet, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaksi {
  id: number;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  penanggungJawab: string;
  bukti: string;
}

const initialData: Transaksi[] = [
  { id: 1, tanggal: "2026-02-06", kategori: "Utilitas", deskripsi: "Pembayaran listrik Januari", nominal: 850000, penanggungJawab: "Bendahara", bukti: "Struk PLN" },
  { id: 2, tanggal: "2026-02-04", kategori: "Perlengkapan", deskripsi: "Pembelian sound system baru", nominal: 4500000, penanggungJawab: "Ketua DKM", bukti: "Nota pembelian" },
  { id: 3, tanggal: "2026-01-30", kategori: "Gaji", deskripsi: "Honor marbot bulan Januari", nominal: 2500000, penanggungJawab: "Bendahara", bukti: "Slip gaji" },
  { id: 4, tanggal: "2026-01-28", kategori: "Kegiatan", deskripsi: "Konsumsi kajian akbar", nominal: 1200000, penanggungJawab: "Seksi Dakwah", bukti: "Nota catering" },
  { id: 5, tanggal: "2026-01-22", kategori: "Perawatan", deskripsi: "Perbaikan AC masjid", nominal: 3200000, penanggungJawab: "Sekretaris", bukti: "Invoice teknisi" },
];

const kategoriOptions = ["Utilitas", "Perlengkapan", "Perawatan", "Gaji", "Kegiatan", "Sosial", "Lainnya"];

const Pengeluaran = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Transaksi[]>(initialData);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Transaksi | null>(null);
  const [formData, setFormData] = useState({ tanggal: "", kategori: "", deskripsi: "", nominal: 0, penanggungJawab: "", bukti: "" });

  const filtered = data.filter((t) => t.deskripsi.toLowerCase().includes(search.toLowerCase()) || t.kategori.toLowerCase().includes(search.toLowerCase()));
  const total = data.reduce((s, t) => s + t.nominal, 0);

  const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  const handleSave = () => {
    if (selected) {
      setData(data.map((t) => (t.id === selected.id ? { ...t, ...formData } : t)));
      toast({ title: "Data pengeluaran diperbarui" });
    } else {
      setData([{ id: Date.now(), ...formData }, ...data]);
      toast({ title: "Pengeluaran ditambahkan" });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (t: Transaksi) => {
    setSelected(t);
    setFormData({ tanggal: t.tanggal, kategori: t.kategori, deskripsi: t.deskripsi, nominal: t.nominal, penanggungJawab: t.penanggungJawab, bukti: t.bukti });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setData(data.filter((t) => t.id !== id));
    toast({ title: "Data dihapus", variant: "destructive" });
  };

  const resetForm = () => { setSelected(null); setFormData({ tanggal: "", kategori: "", deskripsi: "", nominal: 0, penanggungJawab: "", bukti: "" }); };

  const handleExport = (type: "pdf" | "excel") => {
    toast({ title: `Export ${type.toUpperCase()}`, description: "Mengunduh data pengeluaran..." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowDownCircle className="h-6 w-6 text-red-500" />
            Pengeluaran
          </h1>
          <p className="text-muted-foreground">Kelola seluruh pengeluaran keuangan masjid</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("pdf")}>
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        </div>
      </div>

      <Card className="border-red-200 bg-red-50/30">
        <CardContent className="pt-6 flex items-center gap-3">
          <TrendingDown className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600">{formatRupiah(total)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari pengeluaran..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>PJ</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.tanggal}</TableCell>
                  <TableCell><Badge variant="secondary">{t.kategori}</Badge></TableCell>
                  <TableCell>{t.deskripsi}</TableCell>
                  <TableCell className="text-red-600 font-medium">{formatRupiah(t.nominal)}</TableCell>
                  <TableCell>{t.penanggungJawab}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Hapus Data?</AlertDialogTitle><AlertDialogDescription>Data "{t.deskripsi}" akan dihapus.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(t.id)}>Hapus</AlertDialogAction></AlertDialogFooter>
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

      <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected ? "Edit" : "Tambah"} Pengeluaran</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tanggal</Label><Input type="date" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} /></div>
              <div className="space-y-2"><Label>Kategori</Label>
                <Select value={formData.kategori} onValueChange={(v) => setFormData({ ...formData, kategori: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent>{kategoriOptions.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Deskripsi</Label><Input value={formData.deskripsi} onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nominal (Rp)</Label><Input type="number" value={formData.nominal} onChange={(e) => setFormData({ ...formData, nominal: parseInt(e.target.value) || 0 })} /></div>
              <div className="space-y-2"><Label>Penanggung Jawab</Label><Input value={formData.penanggungJawab} onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Bukti/Keterangan</Label><Textarea value={formData.bukti} onChange={(e) => setFormData({ ...formData, bukti: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pengeluaran;
