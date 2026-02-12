import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileSpreadsheet, ClipboardList, TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bulanOptions = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const tahunOptions = ["2026", "2025", "2024"];

const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const operasionalData = {
  "Januari-2026": {
    bulan: "Januari", tahun: "2026",
    saldoAwal: 125000000,
    pendapatan: [
      { akun: "4-1100", nama: "Pendapatan Infaq", jumlah: 17850000 },
      { akun: "4-1200", nama: "Pendapatan Donatur Tetap", jumlah: 16500000 },
      { akun: "4-1300", nama: "Pendapatan Sewa", jumlah: 6600000 },
      { akun: "4-1400", nama: "Pendapatan Zakat", jumlah: 4950000 },
      { akun: "4-1500", nama: "Pendapatan Wakaf", jumlah: 2200000 },
      { akun: "4-1600", nama: "Pendapatan Parkir", jumlah: 3050000 },
    ],
    beban: [
      { akun: "5-1100", nama: "Beban Gaji & Honor", jumlah: 17050000 },
      { akun: "5-1200", nama: "Beban Utilitas", jumlah: 4950000 },
      { akun: "5-1300", nama: "Beban Kebersihan & Perawatan", jumlah: 3520000 },
      { akun: "5-1400", nama: "Beban Kegiatan Dakwah", jumlah: 4400000 },
      { akun: "5-1500", nama: "Beban Kegiatan Sosial", jumlah: 3850000 },
      { akun: "5-1600", nama: "Beban ATK & Perlengkapan", jumlah: 1320000 },
      { akun: "5-1700", nama: "Beban Konsumsi", jumlah: 2200000 },
      { akun: "5-1800", nama: "Beban Perbaikan & Renovasi", jumlah: 4180000 },
    ],
  },
  "Februari-2026": {
    bulan: "Februari", tahun: "2026",
    saldoAwal: 134680000,
    pendapatan: [
      { akun: "4-1100", nama: "Pendapatan Infaq", jumlah: 15500000 },
      { akun: "4-1200", nama: "Pendapatan Donatur Tetap", jumlah: 16500000 },
      { akun: "4-1300", nama: "Pendapatan Sewa", jumlah: 7500000 },
      { akun: "4-1400", nama: "Pendapatan Zakat", jumlah: 3750000 },
      { akun: "4-1500", nama: "Pendapatan Wakaf", jumlah: 1500000 },
      { akun: "4-1600", nama: "Pendapatan Parkir", jumlah: 3500000 },
    ],
    beban: [
      { akun: "5-1100", nama: "Beban Gaji & Honor", jumlah: 17050000 },
      { akun: "5-1200", nama: "Beban Utilitas", jumlah: 5200000 },
      { akun: "5-1300", nama: "Beban Kebersihan & Perawatan", jumlah: 3800000 },
      { akun: "5-1400", nama: "Beban Kegiatan Dakwah", jumlah: 5000000 },
      { akun: "5-1500", nama: "Beban Kegiatan Sosial", jumlah: 4000000 },
      { akun: "5-1600", nama: "Beban ATK & Perlengkapan", jumlah: 1500000 },
      { akun: "5-1700", nama: "Beban Konsumsi", jumlah: 2500000 },
      { akun: "5-1800", nama: "Beban Perbaikan & Renovasi", jumlah: 3750000 },
    ],
  },
};

const LaporanOperasional = () => {
  const { toast } = useToast();
  const [bulan, setBulan] = useState("Januari");
  const [tahun, setTahun] = useState("2026");

  const key = `${bulan}-${tahun}`;
  const data = operasionalData[key as keyof typeof operasionalData] || operasionalData["Januari-2026"];

  const totalPendapatan = data.pendapatan.reduce((s, i) => s + i.jumlah, 0);
  const totalBeban = data.beban.reduce((s, i) => s + i.jumlah, 0);
  const labaRugi = totalPendapatan - totalBeban;
  const saldoAkhir = data.saldoAwal + labaRugi;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-indigo-500" />
            Laporan Operasional
          </h1>
          <p className="text-muted-foreground text-sm">Laporan Laba Rugi sesuai standar akuntansi organisasi nirlaba (ISAK 35)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Export PDF" })}>
            <Download className="h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Export Excel" })}>
            <FileSpreadsheet className="h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      {/* Period */}
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Periode Laporan</p>
          <div className="flex gap-2">
            <Select value={bulan} onValueChange={setBulan}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent>{bulanOptions.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
            <Select value={tahun} onValueChange={setTahun}><SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger><SelectContent>{tahunOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      {/* Header Report */}
      <Card>
        <CardContent className="pt-6 text-center space-y-1">
          <h2 className="font-bold text-lg">MASJID NURUZZAMAN</h2>
          <p className="text-sm text-muted-foreground">Laporan Aktivitas (Laba Rugi)</p>
          <p className="text-sm text-muted-foreground">Periode: {data.bulan} {data.tahun}</p>
        </CardContent>
      </Card>

      {/* Pendapatan */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" /> PENDAPATAN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">No. Akun</TableHead>
                <TableHead>Nama Akun</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pendapatan.map((i) => (
                <TableRow key={i.akun}>
                  <TableCell className="font-mono text-xs">{i.akun}</TableCell>
                  <TableCell>{i.nama}</TableCell>
                  <TableCell className="text-right">{formatRupiah(i.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-green-50">
                <TableCell colSpan={2}>Total Pendapatan</TableCell>
                <TableCell className="text-right text-green-600">{formatRupiah(totalPendapatan)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Beban */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" /> BEBAN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">No. Akun</TableHead>
                <TableHead>Nama Akun</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.beban.map((i) => (
                <TableRow key={i.akun}>
                  <TableCell className="font-mono text-xs">{i.akun}</TableCell>
                  <TableCell>{i.nama}</TableCell>
                  <TableCell className="text-right">{formatRupiah(i.jumlah)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-red-50">
                <TableCell colSpan={2}>Total Beban</TableCell>
                <TableCell className="text-right text-red-600">{formatRupiah(totalBeban)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Saldo Awal</p>
              <p className="text-lg font-bold">{formatRupiah(data.saldoAwal)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Surplus / (Defisit)</p>
              <p className={`text-lg font-bold ${labaRugi >= 0 ? "text-green-600" : "text-red-600"}`}>
                {labaRugi >= 0 ? "+" : ""}{formatRupiah(labaRugi)}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Saldo Akhir</p>
              <p className="text-lg font-bold text-primary">{formatRupiah(saldoAkhir)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaporanOperasional;
