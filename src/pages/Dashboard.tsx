import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  FileText,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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
    title: "Permohonan Reservasi Pending",
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

// Data for bar chart - yearly income/expense
const yearlyData = [
  { bulan: "Jan", pemasukan: 51.15, pengeluaran: 41.47 },
  { bulan: "Feb", pemasukan: 48.25, pengeluaran: 42.80 },
  { bulan: "Mar", pemasukan: 52.30, pengeluaran: 38.50 },
  { bulan: "Apr", pemasukan: 45.80, pengeluaran: 40.20 },
  { bulan: "Mei", pemasukan: 49.60, pengeluaran: 44.30 },
  { bulan: "Jun", pemasukan: 55.40, pengeluaran: 42.10 },
  { bulan: "Jul", pemasukan: 47.20, pengeluaran: 39.80 },
  { bulan: "Agt", pemasukan: 50.10, pengeluaran: 41.60 },
  { bulan: "Sep", pemasukan: 53.80, pengeluaran: 45.20 },
  { bulan: "Okt", pemasukan: 48.90, pengeluaran: 40.70 },
  { bulan: "Nov", pemasukan: 51.60, pengeluaran: 43.50 },
  { bulan: "Des", pemasukan: 58.20, pengeluaran: 48.90 },
];

// Pie chart data for income classification
const pemasukanData = [
  { name: "Donatur Tetap", value: 16500000, color: "hsl(142, 76%, 36%)" },
  { name: "Infaq Jumat", value: 9350000, color: "hsl(142, 70%, 45%)" },
  { name: "Infaq Harian", value: 4620000, color: "hsl(142, 60%, 55%)" },
  { name: "Sewa Ruangan", value: 6600000, color: "hsl(45, 93%, 47%)" },
  { name: "Kotak Amal", value: 3850000, color: "hsl(142, 50%, 65%)" },
  { name: "Zakat & Wakaf", value: 7150000, color: "hsl(142, 40%, 75%)" },
];

// Pie chart data for expense classification
const pengeluaranData = [
  { name: "Honor & Gaji", value: 17050000, color: "hsl(0, 72%, 51%)" },
  { name: "Listrik & Air", value: 4950000, color: "hsl(0, 60%, 60%)" },
  { name: "Kebersihan", value: 3520000, color: "hsl(25, 95%, 53%)" },
  { name: "Kegiatan Dakwah", value: 4400000, color: "hsl(0, 50%, 70%)" },
  { name: "Kegiatan Sosial", value: 3850000, color: "hsl(25, 80%, 65%)" },
  { name: "Lainnya", value: 7700000, color: "hsl(0, 40%, 80%)" },
];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2026");

  const formatRupiah = (value: number) => {
    return `Rp ${value.toFixed(1)}jt`;
  };

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
                <p className={`text-xs mt-1 ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend} dari bulan lalu
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart - Yearly Income/Expense */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Pemasukan & Pengeluaran Bulanan</CardTitle>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="bulan" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value}jt`}
                />
                <Tooltip
                  formatter={(value: number) => formatRupiah(value)}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-600"></div>
              <span className="text-sm text-muted-foreground">Pemasukan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-600"></div>
              <span className="text-sm text-muted-foreground">Pengeluaran</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pie Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pie Chart - Pemasukan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Klasifikasi Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pemasukanData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pemasukanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Rp ${(value / 1000000).toFixed(1)}jt`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Pengeluaran */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Klasifikasi Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pengeluaranData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pengeluaranData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `Rp ${(value / 1000000).toFixed(1)}jt`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend 
                    layout="vertical" 
                    align="right" 
                    verticalAlign="middle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
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
                  <span className={`text-sm font-semibold ${tx.type === "in" ? "text-green-600" : "text-red-600"}`}>
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
