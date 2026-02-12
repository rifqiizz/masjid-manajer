import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";

interface ReservasiEvent {
  id: number;
  penyewa: string;
  ruangan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  status: "pending" | "disetujui" | "ditolak" | "selesai";
}

const mockEvents: ReservasiEvent[] = [
  { id: 1, penyewa: "PT ABC Indonesia", ruangan: "Aula Utama", tanggalMulai: "2026-02-15", tanggalSelesai: "2026-02-15", waktuMulai: "08:00", waktuSelesai: "17:00", keperluan: "Seminar Perusahaan", status: "disetujui" },
  { id: 2, penyewa: "Yayasan Pendidikan XYZ", ruangan: "Ruang Kelas 1", tanggalMulai: "2026-02-20", tanggalSelesai: "2026-02-22", waktuMulai: "09:00", waktuSelesai: "15:00", keperluan: "Pelatihan Guru", status: "disetujui" },
  { id: 3, penyewa: "Komunitas Pemuda", ruangan: "Aula Utama", tanggalMulai: "2026-03-05", tanggalSelesai: "2026-03-05", waktuMulai: "19:00", waktuSelesai: "22:00", keperluan: "Acara Kebersamaan", status: "pending" },
  { id: 4, penyewa: "DKM Nuruzzaman", ruangan: "Ruang Rapat", tanggalMulai: "2026-03-12", tanggalSelesai: "2026-03-12", waktuMulai: "10:00", waktuSelesai: "12:00", keperluan: "Rapat Pengurus", status: "disetujui" },
  { id: 5, penyewa: "Pengajian Ibu-ibu", ruangan: "Aula Utama", tanggalMulai: "2026-04-01", tanggalSelesai: "2026-04-01", waktuMulai: "08:00", waktuSelesai: "12:00", keperluan: "Pengajian Rutin", status: "disetujui" },
  { id: 6, penyewa: "TPA Nuruzzaman", ruangan: "Ruang Kelas 2", tanggalMulai: "2026-01-10", tanggalSelesai: "2026-01-10", waktuMulai: "14:00", waktuSelesai: "17:00", keperluan: "Ujian TPA", status: "selesai" },
];

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  disetujui: "bg-emerald-500",
  ditolak: "bg-red-500",
  selesai: "bg-muted-foreground",
};

const JadwalReservasi = () => {
  const [year, setYear] = useState(2026);
  const [monthsToShow, setMonthsToShow] = useState<"3" | "6" | "12">("6");

  const startMonth = 0; // Always start from January for simplicity
  const count = parseInt(monthsToShow);

  const getMonthDays = (y: number, m: number) => {
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getEventsForDate = (dateStr: string) => {
    return mockEvents.filter((e) => {
      const start = new Date(e.tanggalMulai);
      const end = new Date(e.tanggalSelesai);
      const d = new Date(dateStr);
      return d >= start && d <= end;
    });
  };

  const months = useMemo(() => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const m = (startMonth + i) % 12;
      const y = year + Math.floor((startMonth + i) / 12);
      result.push({ month: m, year: y });
    }
    return result;
  }, [year, count]);

  const gridCols = count <= 3 ? "md:grid-cols-3" : count <= 6 ? "md:grid-cols-3 lg:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-yellow-500" />
            Jadwal Reservasi
          </h1>
          <p className="text-muted-foreground">Kalender multi-bulan untuk melihat jadwal booking ruangan</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={monthsToShow} onValueChange={(v) => setMonthsToShow(v as "3" | "6" | "12")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Bulan</SelectItem>
              <SelectItem value="6">6 Bulan</SelectItem>
              <SelectItem value="12">12 Bulan</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setYear(year - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold w-12 text-center">{year}</span>
            <Button variant="outline" size="icon" onClick={() => setYear(year + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Disetujui</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Pending</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Ditolak</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" /> Selesai</span>
      </div>

      {/* Multi-month Grid */}
      <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
        {months.map(({ month, year: y }) => {
          const { firstDay, daysInMonth } = getMonthDays(y, month);
          const today = new Date();
          const isCurrentMonth = today.getFullYear() === y && today.getMonth() === month;

          return (
            <Card key={`${y}-${month}`} className={isCurrentMonth ? "border-primary" : ""}>
              <CardContent className="p-3">
                <h3 className="text-sm font-semibold mb-2 text-center">
                  {MONTH_NAMES[month]} {y}
                </h3>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0 mb-1">
                  {DAYS.map((d) => (
                    <div key={d} className="text-[10px] text-muted-foreground text-center font-medium">{d}</div>
                  ))}
                </div>
                {/* Days */}
                <div className="grid grid-cols-7 gap-0">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${y}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const events = getEventsForDate(dateStr);
                    const isToday = today.getFullYear() === y && today.getMonth() === month && today.getDate() === day;

                    return (
                      <div
                        key={day}
                        className={`h-8 flex flex-col items-center justify-center relative text-xs rounded-sm ${
                          isToday ? "bg-primary/10 font-bold text-primary" : "hover:bg-muted/50"
                        }`}
                        title={events.map((e) => `${e.penyewa} - ${e.ruangan} (${e.waktuMulai}-${e.waktuSelesai})`).join("\n")}
                      >
                        <span>{day}</span>
                        {events.length > 0 && (
                          <div className="flex gap-0.5 absolute bottom-0.5">
                            {events.slice(0, 3).map((e, idx) => (
                              <span key={idx} className={`h-1.5 w-1.5 rounded-full ${statusColors[e.status]}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming events list */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Reservasi Mendatang</h3>
          <div className="space-y-3">
            {mockEvents
              .filter((e) => e.status !== "ditolak" && new Date(e.tanggalMulai) >= new Date("2026-01-01"))
              .sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime())
              .map((e) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full shrink-0 ${statusColors[e.status]}`} />
                    <div>
                      <p className="text-sm font-medium">{e.penyewa}</p>
                      <p className="text-xs text-muted-foreground">{e.keperluan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">{e.ruangan}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {e.tanggalMulai} • {e.waktuMulai}-{e.waktuSelesai}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JadwalReservasi;
