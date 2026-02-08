import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Wallet, Plus, Pencil, Trash2, Search, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaksi {
  id: number;
  jenis: "pemasukan" | "pengeluaran";
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number;
  penanggungJawab: string;
  bukti: string;
}

const initialTransaksi: Transaksi[] = [
  { id: 1, jenis: "pemasukan", tanggal: "2026-02-07", kategori: "Infaq Jumat", deskripsi: "Infaq sholat Jumat", nominal: 3200000, penanggungJawab: "Bendahara", bukti: "Foto kotak infaq" },
  { id: 2, jenis: "pengeluaran", tanggal: "2026-02-06", kategori: "Utilitas", deskripsi: "Pembayaran listrik Januari", nominal: 850000, penanggungJawab: "Bendahara", bukti: "Struk PLN" },
  { id: 3, jenis: "pemasukan", tanggal: "2026-02-05", kategori: "Sewa", deskripsi: "Sewa Aula - PT ABC", nominal: 2500000, penanggungJawab: "Sekretaris", bukti: "Kwitansi" },
  { id: 4, jenis: "pengeluaran", tanggal: "2026-02-04", kategori: "Perlengkapan", deskripsi: "Pembelian sound system baru", nominal: 4500000, penanggungJawab: "Ketua DKM", bukti: "Nota pembelian" },
  { id: 5, jenis: "pemasukan", tanggal: "2026-02-03", kategori: "Donasi", deskripsi: "Donasi online", nominal: 1750000, penanggungJawab: "Bendahara", bukti: "Screenshot transfer" },
];

const kategoriPemasukan = ["Infaq Jumat", "Infaq Harian", "Zakat", "Donasi", "Sewa", "Lainnya"];
const kategoriPengeluaran = ["Utilitas", "Perlengkapan", "Perawatan", "Gaji", "Kegiatan", "Sosial", "Lainnya"];

const Keuangan = () => {
  const { toast } = useToast();
  const [transaksi, setTransaksi] = useState<Transaksi[]>(initialTransaksi);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"semua" | "pemasukan" | "pengeluaran">("semua");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"pemasukan" | "pengeluaran">("pemasukan");
  const [selectedTransaksi, setSelectedTransaksi] = useState<Transaksi | null>(null);
  const [formData, setFormData] = useState({
    tanggal: "",
    kategori: "",
    deskripsi: "",
    nominal: 0,
    penanggungJawab: "",
    bukti: "",
  });

  const filteredTransaksi = transaksi.filter((t) => {
    const matchSearch =
      t.deskripsi.toLowerCase().includes(search.toLowerCase()) ||
      t.kategori.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "semua" || t.jenis === activeTab;
    return matchSearch && matchTab;
  });

  const totalPemasukan = transaksi.filter((t) => t.jenis === "pemasukan").reduce((sum, t) => sum + t.nominal, 0);
  const totalPengeluaran = transaksi.filter((t) => t.jenis === "pengeluaran").reduce((sum, t) => sum + t.nominal, 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const handleOpenDialog = (type: "pemasukan" | "pengeluaran") => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedTransaksi) {
      setTransaksi(transaksi.map((t) =>
        t.id === selectedTransaksi.id ? { ...t, ...formData, jenis: selectedTransaksi.jenis } : t
      ));
      toast({ title: "Transaksi diperbarui" });
    } else {
      const newTransaksi: Transaksi = {
        id: Date.now(),
        jenis: dialogType,
        ...formData,
      };
      setTransaksi([newTransaksi, ...transaksi]);
      toast({ title: `${dialogType === "pemasukan" ? "Pemasukan" : "Pengeluaran"} ditambahkan` });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleEdit = (t: Transaksi) => {
    setSelectedTransaksi(t);
    setDialogType(t.jenis);
    setFormData({
      tanggal: t.tanggal,
      kategori: t.kategori,
      deskripsi: t.deskripsi,
      nominal: t.nominal,
      penanggungJawab: t.penanggungJawab,
      bukti: t.bukti,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setTransaksi(transaksi.filter((t) => t.id !== id));
    toast({ title: "Transaksi dihapus", variant: "destructive" });
  };

  const resetForm = () => {
    setSelectedTransaksi(null);
    setFormData({
      tanggal: "",
      kategori: "",
      deskripsi: "",
      nominal: 0,
      penanggungJawab: "",
      bukti: "",
    });
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-6 w-6 text-green-500" />
            Keuangan
          </h1>
          <p className="text-muted-foreground">Kelola pemasukan dan pengeluaran masjid</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => handleOpenDialog("pemasukan")}>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
            Pemasukan
          </Button>
          <Button className="gap-2" onClick={() => handleOpenDialog("pengeluaran")}>
            <ArrowDownCircle className="h-4 w-4" />
            Pengeluaran
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Kas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(saldo)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatRupiah(totalPemasukan)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatRupiah(totalPengeluaran)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="semua">Semua</TabsTrigger>
                <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
                <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi..."
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
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>PJ</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransaksi.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.tanggal}</TableCell>
                  <TableCell>
                    <Badge variant={t.jenis === "pemasukan" ? "default" : "destructive"}>
                      {t.jenis === "pemasukan" ? "Masuk" : "Keluar"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t.kategori}</Badge>
                  </TableCell>
                  <TableCell>{t.deskripsi}</TableCell>
                  <TableCell className={t.jenis === "pemasukan" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {t.jenis === "pemasukan" ? "+" : "-"}{formatRupiah(t.nominal)}
                  </TableCell>
                  <TableCell>{t.penanggungJawab}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
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
                            <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Transaksi "{t.deskripsi}" akan dihapus permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(t.id)}>Hapus</AlertDialogAction>
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

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialogType === "pemasukan" ? (
                <ArrowUpCircle className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownCircle className="h-5 w-5 text-red-600" />
              )}
              {selectedTransaksi ? "Edit" : "Tambah"} {dialogType === "pemasukan" ? "Pemasukan" : "Pengeluaran"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={formData.kategori} onValueChange={(v) => setFormData({ ...formData, kategori: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {(dialogType === "pemasukan" ? kategoriPemasukan : kategoriPengeluaran).map((k) => (
                      <SelectItem key={k} value={k}>{k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Input
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Keterangan transaksi"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nominal">Nominal (Rp)</Label>
                <Input
                  id="nominal"
                  type="number"
                  value={formData.nominal}
                  onChange={(e) => setFormData({ ...formData, nominal: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pj">Penanggung Jawab</Label>
                <Input
                  id="pj"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  placeholder="Nama PJ"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bukti">Bukti/Keterangan</Label>
              <Textarea
                id="bukti"
                value={formData.bukti}
                onChange={(e) => setFormData({ ...formData, bukti: e.target.value })}
                placeholder="Keterangan bukti transaksi..."
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
  );
};

export default Keuangan;
