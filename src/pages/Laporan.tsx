import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, TrendingUp, TrendingDown, Clock, Wallet, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LaporanDetail {
  bulan: string;
  tahun: string;
  saldoAwal: number;
  saldoAkhir: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  surplus: number;
  pemasukan: { no: number; kategori: string; jumlah: number }[];
  pengeluaran: { no: number; kategori: string; jumlah: number }[];
}

const laporanData: Record<string, LaporanDetail> = {
  "Januari-2026": {
    bulan: "Januari",
    tahun: "2026",
    saldoAwal: 125000000,
    saldoAkhir: 134680000,
    totalPemasukan: 51150000,
    totalPengeluaran: 41470000,
    surplus: 9680000,
    pemasukan: [
      { no: 1, kategori: "Donatur Tetap", jumlah: 16500000 },
      { no: 2, kategori: "Infaq Jumat", jumlah: 9350000 },
      { no: 3, kategori: "Infaq Harian", jumlah: 4620000 },
      { no: 4, kategori: "Infaq Parkir", jumlah: 3880000 },
      { no: 5, kategori: "Kotak Amal", jumlah: 3850000 },
      { no: 6, kategori: "Sewa Ruangan", jumlah: 6600000 },
      { no: 7, kategori: "Zakat", jumlah: 4950000 },
      { no: 8, kategori: "Wakaf", jumlah: 2200000 },
    ],
    pengeluaran: [
      { no: 1, kategori: "Listrik & Air", jumlah: 4950000 },
      { no: 2, kategori: "Kebersihan & Perawatan", jumlah: 3520000 },
      { no: 3, kategori: "Honor Staf", jumlah: 8800000 },
      { no: 4, kategori: "Honor Imam Rawatib", jumlah: 5500000 },
      { no: 5, kategori: "Honor Muadzin", jumlah: 2750000 },
      { no: 6, kategori: "Kegiatan Dakwah", jumlah: 4400000 },
      { no: 7, kategori: "Kegiatan Sosial", jumlah: 3850000 },
      { no: 8, kategori: "ATK & Perlengkapan", jumlah: 1320000 },
      { no: 9, kategori: "Konsumsi Kajian", jumlah: 2200000 },
      { no: 10, kategori: "Perbaikan & Renovasi", jumlah: 4180000 },
    ],
  },
  "Februari-2026": {
    bulan: "Februari",
    tahun: "2026",
    saldoAwal: 134680000,
    saldoAkhir: 140130000,
    totalPemasukan: 48250000,
    totalPengeluaran: 42800000,
    surplus: 5450000,
    pemasukan: [
      { no: 1, kategori: "Donatur Tetap", jumlah: 16500000 },
      { no: 2, kategori: "Infaq Jumat", jumlah: 8200000 },
      { no: 3, kategori: "Infaq Harian", jumlah: 4100000 },
      { no: 4, kategori: "Infaq Parkir", jumlah: 3500000 },
      { no: 5, kategori: "Kotak Amal", jumlah: 3200000 },
      { no: 6, kategori: "Sewa Ruangan", jumlah: 7500000 },
      { no: 7, kategori: "Zakat", jumlah: 3750000 },
      { no: 8, kategori: "Wakaf", jumlah: 1500000 },
    ],
    pengeluaran: [
      { no: 1, kategori: "Listrik & Air", jumlah: 5200000 },
      { no: 2, kategori: "Kebersihan & Perawatan", jumlah: 3800000 },
      { no: 3, kategori: "Honor Staf", jumlah: 8800000 },
      { no: 4, kategori: "Honor Imam Rawatib", jumlah: 5500000 },
      { no: 5, kategori: "Honor Muadzin", jumlah: 2750000 },
      { no: 6, kategori: "Kegiatan Dakwah", jumlah: 5000000 },
      { no: 7, kategori: "Kegiatan Sosial", jumlah: 4000000 },
      { no: 8, kategori: "ATK & Perlengkapan", jumlah: 1500000 },
      { no: 9, kategori: "Konsumsi Kajian", jumlah: 2500000 },
      { no: 10, kategori: "Perbaikan & Renovasi", jumlah: 3750000 },
    ],
  },
};

const bulanOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
const tahunOptions = ["2026", "2025", "2024"];

const Laporan = () => {
  const { toast } = useToast();
  const [selectedBulan, setSelectedBulan] = useState("Januari");
  const [selectedTahun, setSelectedTahun] = useState("2026");

  const key = `${selectedBulan}-${selectedTahun}`;
  const data = laporanData[key] || laporanData["Januari-2026"];

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const handleExportPDF = () => {
    toast({ title: "Mengunduh Laporan PDF", description: `Laporan ${selectedBulan} ${selectedTahun}` });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="outline" className="gap-1 text-primary border-primary">
          <FileCheck className="h-3 w-3" />
          Amanah & Transparan
        </Badge>
        <h1 className="text-2xl font-bold text-foreground">Laporan Keuangan Masjid</h1>
        <p className="text-muted-foreground text-sm">
          Laporan keuangan dipublikasikan sebagai bentuk pertanggungjawaban pengurus kepada jamaah dan umat.
        </p>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Pilih Periode Laporan
            </div>
            <div className="flex gap-2">
              <Select value={selectedBulan} onValueChange={setSelectedBulan}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bulanOptions.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTahun} onValueChange={setSelectedTahun}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tahunOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saldo Awal & Akhir */}
      <Card className="bg-amber-50/50 border-amber-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span>Saldo Awal</span>
              </div>
              <p className="text-xs text-muted-foreground">1 {data.bulan} {data.tahun}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{formatRupiah(data.saldoAwal)}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Wallet className="h-4 w-4" />
                <span>Saldo Akhir</span>
              </div>
              <p className="text-xs text-muted-foreground">Akhir {data.bulan} {data.tahun}</p>
              <p className="text-2xl font-bold text-primary mt-1">{formatRupiah(data.saldoAkhir)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Total Pemasukan</span>
            </div>
            <p className="text-xs text-muted-foreground">{data.bulan} {data.tahun}</p>
            <p className="text-xl font-bold text-green-600 mt-1">{formatRupiah(data.totalPemasukan)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span>Total Pengeluaran</span>
            </div>
            <p className="text-xs text-muted-foreground">{data.bulan} {data.tahun}</p>
            <p className="text-xl font-bold text-red-600 mt-1">{formatRupiah(data.totalPengeluaran)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Wallet className="h-4 w-4 text-primary" />
              <span>Surplus/Defisit</span>
            </div>
            <p className="text-xs text-muted-foreground">{data.bulan} {data.tahun}</p>
            <p className={`text-xl font-bold mt-1 ${data.surplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.surplus >= 0 ? '+' : ''}{formatRupiah(data.surplus)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pemasukan Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-green-600">
            <TrendingUp className="h-5 w-5" />
            Pemasukan - {data.bulan} {data.tahun}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pemasukan.map((item) => (
                <TableRow key={item.no}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>{item.kategori}</TableCell>
                  <TableCell className="text-right">{formatRupiah(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={2}>Total Pemasukan</TableCell>
                <TableCell className="text-right text-green-600">{formatRupiah(data.totalPemasukan)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pengeluaran Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-red-600">
            <TrendingDown className="h-5 w-5" />
            Pengeluaran - {data.bulan} {data.tahun}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pengeluaran.map((item) => (
                <TableRow key={item.no}>
                  <TableCell>{item.no}</TableCell>
                  <TableCell>{item.kategori}</TableCell>
                  <TableCell className="text-right">{formatRupiah(item.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={2}>Total Pengeluaran</TableCell>
                <TableCell className="text-right text-red-600">{formatRupiah(data.totalPengeluaran)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Quote & Download */}
      <div className="text-center space-y-4 py-6">
        <p className="text-muted-foreground italic text-sm">
          "Sesungguhnya amanah itu akan dimintai pertanggungjawaban."
        </p>
        <Button onClick={handleExportPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Unduh Laporan PDF
        </Button>
        <p className="text-xs text-muted-foreground">
          Laporan ini diperbarui setiap awal bulan. Untuk pertanyaan, silakan hubungi pengurus masjid.
        </p>
      </div>
    </div>
  );
};

export default Laporan;
