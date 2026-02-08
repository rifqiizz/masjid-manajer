import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, FileSpreadsheet, FileText, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LaporanPeriode {
  id: number;
  periode: string;
  jenis: "bulanan" | "tahunan";
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
  dipublikasikan: boolean;
}

const initialLaporan: LaporanPeriode[] = [
  { id: 1, periode: "Februari 2026", jenis: "bulanan", pemasukan: 12800000, pengeluaran: 7350000, saldo: 5450000, dipublikasikan: false },
  { id: 2, periode: "Januari 2026", jenis: "bulanan", pemasukan: 15200000, pengeluaran: 8900000, saldo: 6300000, dipublikasikan: true },
  { id: 3, periode: "Desember 2025", jenis: "bulanan", pemasukan: 18500000, pengeluaran: 12000000, saldo: 6500000, dipublikasikan: true },
  { id: 4, periode: "Tahun 2025", jenis: "tahunan", pemasukan: 185000000, pengeluaran: 142000000, saldo: 43000000, dipublikasikan: true },
];

const Laporan = () => {
  const { toast } = useToast();
  const [laporan, setLaporan] = useState<LaporanPeriode[]>(initialLaporan);
  const [filterJenis, setFilterJenis] = useState<"semua" | "bulanan" | "tahunan">("semua");
  const [filterTahun, setFilterTahun] = useState("2026");

  const filteredLaporan = laporan.filter((l) => {
    const matchJenis = filterJenis === "semua" || l.jenis === filterJenis;
    const matchTahun = l.periode.includes(filterTahun);
    return matchJenis && matchTahun;
  });

  const handlePublish = (id: number) => {
    setLaporan(laporan.map((l) => l.id === id ? { ...l, dipublikasikan: true } : l));
    toast({ title: "Laporan dipublikasikan ke website" });
  };

  const handleExport = (format: "pdf" | "excel", periode: string) => {
    toast({ title: `Mengunduh laporan ${periode} (${format.toUpperCase()})` });
  };

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const totalPemasukan = filteredLaporan.reduce((sum, l) => sum + l.pemasukan, 0);
  const totalPengeluaran = filteredLaporan.reduce((sum, l) => sum + l.pengeluaran, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-500" />
            Laporan Keuangan
          </h1>
          <p className="text-muted-foreground">Laporan bulanan, tahunan, filter periode, dan export</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan (Filtered)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatRupiah(totalPemasukan)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran (Filtered)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatRupiah(totalPengeluaran)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <Label>Jenis Laporan</Label>
              <Select value={filterJenis} onValueChange={(v) => setFilterJenis(v as typeof filterJenis)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="bulanan">Bulanan</SelectItem>
                  <SelectItem value="tahunan">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tahun</Label>
              <Select value={filterTahun} onValueChange={setFilterTahun}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
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
                <TableHead>Periode</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Pemasukan</TableHead>
                <TableHead>Pengeluaran</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLaporan.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.periode}</TableCell>
                  <TableCell>
                    <Badge variant={l.jenis === "tahunan" ? "default" : "secondary"}>
                      {l.jenis === "tahunan" ? "Tahunan" : "Bulanan"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-green-600">{formatRupiah(l.pemasukan)}</TableCell>
                  <TableCell className="text-red-600">{formatRupiah(l.pengeluaran)}</TableCell>
                  <TableCell className="font-medium">{formatRupiah(l.saldo)}</TableCell>
                  <TableCell>
                    {l.dipublikasikan ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Dipublikasikan
                      </Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExport("pdf", l.periode)}
                        title="Export PDF"
                      >
                        <FileText className="h-4 w-4 text-red-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExport("excel", l.periode)}
                        title="Export Excel"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      </Button>
                      {!l.dipublikasikan && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(l.id)}
                          className="text-xs"
                        >
                          Publikasikan
                        </Button>
                      )}
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

export default Laporan;
