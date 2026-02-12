import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileSpreadsheet, Briefcase, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const bulanOptions = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const tahunOptions = ["2026", "2025", "2024"];

const formatRupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const formatShort = (n: number) => `${(n / 1000000).toFixed(1)}jt`;

interface PeriodData {
  pemasukan: number;
  pengeluaran: number;
  saldoAwal: number;
  kategoriPemasukan: { nama: string; jumlah: number }[];
  kategoriPengeluaran: { nama: string; jumlah: number }[];
}

const periodData: Record<string, PeriodData> = {
  "Januari-2026": {
    pemasukan: 51150000, pengeluaran: 41470000, saldoAwal: 125000000,
    kategoriPemasukan: [
      { nama: "Donatur Tetap", jumlah: 16500000 }, { nama: "Infaq Jumat", jumlah: 9350000 },
      { nama: "Sewa Ruangan", jumlah: 6600000 }, { nama: "Zakat", jumlah: 4950000 },
      { nama: "Infaq Harian", jumlah: 4620000 }, { nama: "Lainnya", jumlah: 9130000 },
    ],
    kategoriPengeluaran: [
      { nama: "Honor & Gaji", jumlah: 17050000 }, { nama: "Kegiatan", jumlah: 8250000 },
      { nama: "Utilitas", jumlah: 4950000 }, { nama: "Renovasi", jumlah: 4180000 },
      { nama: "Kebersihan", jumlah: 3520000 }, { nama: "Lainnya", jumlah: 3520000 },
    ],
  },
  "Februari-2026": {
    pemasukan: 48250000, pengeluaran: 42800000, saldoAwal: 134680000,
    kategoriPemasukan: [
      { nama: "Donatur Tetap", jumlah: 16500000 }, { nama: "Infaq Jumat", jumlah: 8200000 },
      { nama: "Sewa Ruangan", jumlah: 7500000 }, { nama: "Zakat", jumlah: 3750000 },
      { nama: "Infaq Harian", jumlah: 4100000 }, { nama: "Lainnya", jumlah: 8200000 },
    ],
    kategoriPengeluaran: [
      { nama: "Honor & Gaji", jumlah: 17050000 }, { nama: "Kegiatan", jumlah: 9000000 },
      { nama: "Utilitas", jumlah: 5200000 }, { nama: "Renovasi", jumlah: 3750000 },
      { nama: "Kebersihan", jumlah: 3800000 }, { nama: "Lainnya", jumlah: 4000000 },
    ],
  },
};

const LaporanEksekutif = () => {
  const { toast } = useToast();
  const [bulan, setBulan] = useState("Februari");
  const [tahun, setTahun] = useState("2026");

  const key = `${bulan}-${tahun}`;
  const current = periodData[key] || periodData["Februari-2026"];

  // Previous period
  const bulanIdx = bulanOptions.indexOf(bulan);
  const prevBulan = bulanIdx > 0 ? bulanOptions[bulanIdx - 1] : bulanOptions[11];
  const prevTahun = bulanIdx > 0 ? tahun : String(parseInt(tahun) - 1);
  const prevKey = `${prevBulan}-${prevTahun}`;
  const prev = periodData[prevKey] || null;

  const surplus = current.pemasukan - current.pengeluaran;
  const saldoAkhir = current.saldoAwal + surplus;
  const prevSurplus = prev ? prev.pemasukan - prev.pengeluaran : 0;

  const pctChange = (curr: number, prevVal: number) => {
    if (!prevVal) return null;
    return ((curr - prevVal) / prevVal * 100).toFixed(1);
  };

  const chartData = [
    ...(prev ? [{ periode: prevBulan, Pemasukan: prev.pemasukan, Pengeluaran: prev.pengeluaran }] : []),
    { periode: bulan, Pemasukan: current.pemasukan, Pengeluaran: current.pengeluaran },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-amber-600" />
            Laporan Eksekutif
          </h1>
          <p className="text-muted-foreground text-sm">Ringkasan keuangan untuk stakeholder masjid dengan perbandingan periode sebelumnya</p>
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

      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Periode</p>
          <div className="flex gap-2">
            <Select value={bulan} onValueChange={setBulan}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent>{bulanOptions.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select>
            <Select value={tahun} onValueChange={setTahun}><SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger><SelectContent>{tahunOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Pemasukan</p>
            <p className="text-xl font-bold text-green-600">{formatRupiah(current.pemasukan)}</p>
            {prev && (
              <div className="flex items-center gap-1 mt-1 text-xs">
                {current.pemasukan >= prev.pemasukan ? <ArrowUpRight className="h-3 w-3 text-green-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span className={current.pemasukan >= prev.pemasukan ? "text-green-600" : "text-red-600"}>
                  {pctChange(current.pemasukan, prev.pemasukan)}%
                </span>
                <span className="text-muted-foreground">vs {prevBulan}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Pengeluaran</p>
            <p className="text-xl font-bold text-red-600">{formatRupiah(current.pengeluaran)}</p>
            {prev && (
              <div className="flex items-center gap-1 mt-1 text-xs">
                {current.pengeluaran <= prev.pengeluaran ? <ArrowDownRight className="h-3 w-3 text-green-500" /> : <ArrowUpRight className="h-3 w-3 text-red-500" />}
                <span className={current.pengeluaran <= prev.pengeluaran ? "text-green-600" : "text-red-600"}>
                  {pctChange(current.pengeluaran, prev.pengeluaran)}%
                </span>
                <span className="text-muted-foreground">vs {prevBulan}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Surplus/Defisit</p>
            <p className={`text-xl font-bold ${surplus >= 0 ? "text-green-600" : "text-red-600"}`}>
              {surplus >= 0 ? "+" : ""}{formatRupiah(surplus)}
            </p>
            {prev && (
              <div className="flex items-center gap-1 mt-1 text-xs">
                {surplus >= prevSurplus ? <ArrowUpRight className="h-3 w-3 text-green-500" /> : <ArrowDownRight className="h-3 w-3 text-red-500" />}
                <span className="text-muted-foreground">Prev: {formatRupiah(prevSurplus)}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-primary">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground mb-1">Saldo Akhir</p>
            <p className="text-xl font-bold text-primary">{formatRupiah(saldoAkhir)}</p>
            <p className="text-xs text-muted-foreground mt-1">Saldo Awal: {formatRupiah(current.saldoAwal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader><CardTitle className="text-base">Perbandingan Periode</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periode" />
              <YAxis tickFormatter={formatShort} />
              <Tooltip formatter={(v: number) => formatRupiah(v)} />
              <Legend />
              <Bar dataKey="Pemasukan" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Breakdown Tables side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" /> Komposisi Pemasukan</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {current.kategoriPemasukan.map((k) => (
                  <TableRow key={k.nama}>
                    <TableCell className="text-sm">{k.nama}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatRupiah(k.jumlah)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground w-16">
                      {(k.jumlah / current.pemasukan * 100).toFixed(0)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="h-4 w-4 text-red-600" /> Komposisi Pengeluaran</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {current.kategoriPengeluaran.map((k) => (
                  <TableRow key={k.nama}>
                    <TableCell className="text-sm">{k.nama}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatRupiah(k.jumlah)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground w-16">
                      {(k.jumlah / current.pengeluaran * 100).toFixed(0)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaporanEksekutif;
