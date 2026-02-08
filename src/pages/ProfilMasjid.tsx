import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Building2, Save, MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfilMasjid = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: "Masjid Raya Al-Ikhlas",
    alamat: "Jl. Masjid Raya No. 123, Kelurahan Sukamaju, Kecamatan Ciputat, Tangerang Selatan 15411",
    telepon: "(021) 7412345",
    email: "dkm@masjidraya-alikhlas.or.id",
    website: "https://masjidraya-alikhlas.or.id",
    deskripsi: "Masjid Raya Al-Ikhlas adalah masjid bersejarah yang telah berdiri sejak tahun 1985. Masjid ini menjadi pusat kegiatan keagamaan dan sosial masyarakat sekitar.",
    jamOperasional: "04:30 - 22:00 WIB",
    tahunBerdiri: "1985",
    luasBangunan: "2.500 m²",
    kapasitasJamaah: "3.000 orang",
  });

  const [visibility, setVisibility] = useState({
    tampilkanAlamat: true,
    tampilkanTelepon: true,
    tampilkanEmail: true,
    tampilkanJadwalSholat: true,
    tampilkanKegiatan: true,
    tampilkanKeuangan: false,
  });

  const handleSave = () => {
    toast({
      title: "Berhasil disimpan",
      description: "Data profil masjid telah diperbarui.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-600" />
            Profil Masjid
          </h1>
          <p className="text-muted-foreground">Kelola data lengkap dan pengaturan visibilitas publik masjid</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Simpan Perubahan
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Utama */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Utama</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Masjid</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat Lengkap</Label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Kontak */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telepon" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Telepon
              </Label>
              <Input
                id="telepon"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jam" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Jam Operasional
              </Label>
              <Input
                id="jam"
                value={formData.jamOperasional}
                onChange={(e) => setFormData({ ...formData, jamOperasional: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Info Tambahan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informasi Tambahan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tahun">Tahun Berdiri</Label>
                <Input
                  id="tahun"
                  value={formData.tahunBerdiri}
                  onChange={(e) => setFormData({ ...formData, tahunBerdiri: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="luas">Luas Bangunan</Label>
                <Input
                  id="luas"
                  value={formData.luasBangunan}
                  onChange={(e) => setFormData({ ...formData, luasBangunan: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kapasitas">Kapasitas Jamaah</Label>
              <Input
                id="kapasitas"
                value={formData.kapasitasJamaah}
                onChange={(e) => setFormData({ ...formData, kapasitasJamaah: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pengaturan Visibilitas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pengaturan Visibilitas Publik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "tampilkanAlamat", label: "Tampilkan Alamat di Website" },
              { key: "tampilkanTelepon", label: "Tampilkan Telepon di Website" },
              { key: "tampilkanEmail", label: "Tampilkan Email di Website" },
              { key: "tampilkanJadwalSholat", label: "Tampilkan Jadwal Sholat" },
              { key: "tampilkanKegiatan", label: "Tampilkan Kegiatan Publik" },
              { key: "tampilkanKeuangan", label: "Tampilkan Laporan Keuangan" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <Label htmlFor={item.key}>{item.label}</Label>
                <Switch
                  id={item.key}
                  checked={visibility[item.key as keyof typeof visibility]}
                  onCheckedChange={(checked) =>
                    setVisibility({ ...visibility, [item.key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilMasjid;
