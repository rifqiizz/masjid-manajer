import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  FileText,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Saldo Kas",
    value: "Rp 45.250.000",
    icon: Wallet,
    highlight: true,
  },
  {
    title: "Pemasukan Bulan Ini",
    value: "Rp 12.800.000",
    icon: TrendingUp,
    trend: "+8%",
    trendUp: true,
  },
  {
    title: "Pengeluaran Bulan Ini",
    value: "Rp 7.350.000",
    icon: TrendingDown,
    trend: "-3%",
    trendUp: false,
  },
  {
    title: "Permohonan Sewa Pending",
    value: "3",
    icon: FileText,
  },
];

const upcomingActivities = [
  { name: "Kajian Rutin Ahad", date: "9 Feb 2026", pic: "Ust. Ahmad" },
  { name: "Rapat Pengurus Bulanan", date: "12 Feb 2026", pic: "Ketua DKM" },
  { name: "Bersih-bersih Masjid", date: "15 Feb 2026", pic: "Seksi Kebersihan" },
  { name: "Santunan Anak Yatim", date: "20 Feb 2026", pic: "Bendahara" },
];

const recentTransactions = [
  { desc: "Infaq Jum'at", amount: "+Rp 3.200.000", type: "in" },
  { desc: "Pembayaran Listrik", amount: "-Rp 850.000", type: "out" },
  { desc: "Sewa Aula - PT ABC", amount: "+Rp 2.500.000", type: "in" },
  { desc: "Pembelian Sound System", amount: "-Rp 4.500.000", type: "out" },
  { desc: "Donasi Online", amount: "+Rp 1.750.000", type: "in" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas dan keuangan masjid</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={stat.highlight ? "border-primary bg-primary/5" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.highlight ? "text-primary" : ""}`}>
                {stat.value}
              </div>
              {stat.trend && (
                <p className={`text-xs mt-1 ${stat.trendUp ? "text-success" : "text-destructive"}`}>
                  {stat.trend} dari bulan lalu
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Kegiatan Terdekat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingActivities.map((act) => (
                <div key={act.name} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium text-sm">{act.name}</p>
                    <p className="text-xs text-muted-foreground">{act.date}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    {act.pic}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <p className="font-medium text-sm">{tx.desc}</p>
                  <span className={`text-sm font-semibold ${tx.type === "in" ? "text-success" : "text-destructive"}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
