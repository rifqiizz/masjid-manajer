

# Rencana Pengembangan Sistem Informasi DKM Masjid Nuruzzaman

Ini adalah rencana komprehensif yang dibagi menjadi beberapa fase implementasi bertahap. Mengingat skala perubahan yang besar, implementasi akan dilakukan secara iteratif.

---

## Fase 1: Database Schema Updates

### 1A. Perubahan Tabel `ruangan`
- Tambah kolom `type` (enum: `bookable`, `non_bookable`) -- membedakan ruangan yang bisa dipesan vs area umum
- Tambah kolom `category` (text) -- misal: ruang meeting, aula, area parkir, area wudhu
- Tambah kolom `price` (numeric, nullable) -- harga sewa untuk yang bookable
- Tambah kolom `rules` (text) -- aturan penggunaan
- Tambah kolom `facilities` (text) -- fasilitas yang tersedia

### 1B. Tabel `ruangan_gallery` (baru)
- `id`, `ruangan_id` (FK), `image_url`, `caption`, `sort_order`, `created_at`
- Storage bucket `ruangan-gallery` untuk upload gambar

### 1C. Tabel `mosque_gallery` (baru)
- `id`, `mosque_profile_id` (FK), `image_url`, `caption`, `sort_order`, `created_at`
- Storage bucket `mosque-gallery`

### 1D. Tabel `mosque_profile` -- tambah kolom
- `tahun_berdiri`, `luas_bangunan`, `kapasitas_jamaah`, `jam_operasional`

### 1E. Tabel `website_sections` (baru) -- mengganti visibility settings di ProfilMasjid
- `id`, `section_key` (hero, momentum, berita, kajian, activities, articles, facilities, room_rental, finance, instagram_feed)
- `is_visible` (boolean), `config_json` (jsonb), `sort_order`

### 1F. Tabel `kegiatan` (baru)
- `id`, `nama`, `tanggal`, `waktu_mulai`, `waktu_selesai`, `room_id` (FK ruangan), `penanggung_jawab`, `status` (enum: dijadwalkan, berlangsung, selesai, dibatalkan), `deskripsi`, `type` (internal), `created_by`, timestamps

### 1G. Tabel `fasilitas` (update) -- manajemen aset
- `id`, `nama`, `kategori`, `ruangan_id` (FK), `kondisi` (enum), `is_active`, `tanggal_perawatan`, `catatan_perawatan`, timestamps

### 1H. Tabel `tugas` (baru)
- `id`, `title`, `description`, `priority` (enum: low, medium, high), `column_id` (backlog, todo, in_progress, done), `assignee_id` (FK profiles), `labels` (text[]), `sort_order`, `created_by`, timestamps

### 1I. Tabel `audit_logs` (baru)
- `id`, `user_id` (FK), `action` (text), `module` (text), `detail` (text), `ip_address` (text), `metadata` (jsonb), `created_at`
- Trigger function untuk auto-capture perubahan di setiap tabel utama

### 1J. Seed data Chart of Accounts
- Insert pos-pos keuangan standar yayasan masjid:
  - **Aset**: Kas & Bank, Piutang, Persediaan, Aset Tetap
  - **Kewajiban**: Hutang Usaha, Hutang Lainnya
  - **Ekuitas/Aset Neto**: Tanpa Pembatasan, Dengan Pembatasan
  - **Pendapatan**: Infaq Jumat, Infaq Harian, Zakat, Donasi, Sewa, Wakaf, Parkir
  - **Beban**: Listrik & Air, Kebersihan, Honor, Kegiatan Dakwah, Sosial, ATK, Konsumsi, Perbaikan

### 1K. RLS Policies
- Semua tabel baru mengikuti pola existing: read untuk authenticated, write berdasarkan role
- `audit_logs`: read-only untuk semua authenticated, insert via security definer function saja

---

## Fase 2: UI Updates -- Sidebar & Layout

### 2A. Sidebar Collapse/Expand
- Tambah tombol collapse/expand di header sidebar (icon `PanelLeftClose`/`PanelLeftOpen`)
- Mode collapsed: sidebar menyempit ke ~w-14, hanya tampil icon tanpa teks
- Gunakan state di DashboardLayout agar header content ikut adjust

### 2B. Reorganisasi Menu Sidebar
```text
UTAMA
  Dashboard
  Profil Masjid

KONTEN
  Kelola Postingan (external link)

OPERASIONAL
  Kegiatan
  Tugas
  Ruangan
  Reservasi
  Jadwal Reservasi (read-only)
  Fasilitas

KEUANGAN
  Pemasukan
  Pengeluaran

LAPORAN
  Laporan Publik
  Laporan Operasional
  Laporan Eksekutif

DATA & PENGGUNA
  Jamaah
  Manajemen User

SISTEM
  Pengaturan Website  <-- baru, pindah dari ProfilMasjid
  Audit Trail
```

### 2C. Responsivitas
- Sidebar: auto-collapse di mobile (< 768px), tampilkan hamburger trigger di header
- Semua tabel: gunakan horizontal scroll wrapper di mobile
- Kanban board: horizontal scroll di mobile, 1 kolom visible at a time
- Form dialog: full-screen sheet di mobile

---

## Fase 3: UI Updates -- Page by Page

### 3A. Profil Masjid (`/profil-masjid`)
- Hapus section "Pengaturan Visibilitas Publik" (pindah ke `/pengaturan`)
- Tambah fitur galeri foto masjid (upload, reorder, delete)
- Tambah kolom informasi tambahan (tahun berdiri, luas, kapasitas)
- Connect ke Supabase `mosque_profile` + `mosque_gallery`

### 3B. Pengaturan Website (`/pengaturan`) -- halaman baru
- Pindahkan visibility toggles dari ProfilMasjid
- Kelola 10 section website publik: Hero, Momentum, Berita, Kajian, Activities, Articles, Facilities, Room Rental, Finance, Instagram Feed
- Masing-masing section bisa on/off + konfigurasi konten (JSON)

### 3C. Ruangan (`/ruangan`)
- Tambah kolom "Jenis" (Bisa Dipesan / Tidak Bisa Dipesan)
- Tambah fitur galeri per ruangan
- Filter by jenis
- Connect ke Supabase `ruangan` + `ruangan_gallery`

### 3D. Kegiatan (`/kegiatan`)
- Tambah field `room_id` untuk memilih ruangan dari master data
- Deteksi bentrok jadwal dengan reservasi (shared schedule)
- Connect ke Supabase `kegiatan` table (baru)

### 3E. Reservasi (`/reservasi`)
- Room selection dari data `ruangan` (hanya yang `bookable`)
- Deteksi bentrok jadwal termasuk kegiatan internal
- Connect ke Supabase `reservasi`

### 3F. Jadwal Reservasi (`/jadwal-reservasi`)
- Read-only view, menampilkan gabungan Kegiatan + Reservasi
- Warna berbeda: biru untuk kegiatan internal, kuning untuk reservasi eksternal
- Legend yang jelas

### 3G. Fasilitas (`/fasilitas`)
- Lokasi dropdown dari data `ruangan` (bukan free text)
- Connect ke Supabase `fasilitas`

### 3H. Tugas (`/tugas`)
- Connect Kanban board ke Supabase `tugas`
- Assignee dari data `profiles`

### 3I. Pemasukan & Pengeluaran
- Connect ke Supabase, kategori dari `chart_of_accounts`
- Auto-create journal entry saat transaksi dibuat

### 3J. Laporan (Publik, Operasional, Eksekutif)
- Data dari journal entries & general ledger view
- Format laporan keuangan standar (Laporan Posisi Keuangan, Laporan Aktivitas per ISAK 35)

### 3K. Audit Trail
- Connect ke Supabase `audit_logs`
- Read-only, filter by modul/aksi/user/tanggal

### 3L. Manajemen User & Jamaah
- Lanjutkan sesuai desain existing, connect ke Supabase

---

## Prioritas Implementasi

Karena volume perubahan sangat besar, disarankan implementasi bertahap:

1. **Batch 1**: Database migration (semua schema) + Sidebar collapse + Responsivitas dasar
2. **Batch 2**: Profil Masjid + Ruangan + Fasilitas (master data terlebih dahulu)
3. **Batch 3**: Kegiatan + Reservasi + Jadwal Reservasi (shared schedule)
4. **Batch 4**: Keuangan (Pemasukan, Pengeluaran, CoA seed data)
5. **Batch 5**: Tugas Kanban DB + Audit Trail DB + Pengaturan Website
6. **Batch 6**: Laporan profesional + User management

---

## Detail Teknis

- **Storage buckets**: `mosque-gallery` dan `ruangan-gallery` dengan policy public read, authenticated write
- **Audit trail**: Implementasi via database trigger function `log_audit()` yang insert ke `audit_logs` pada setiap INSERT/UPDATE/DELETE di tabel utama
- **Shared schedule**: Query gabungan kegiatan + reservasi dengan UNION ALL untuk jadwal reservasi
- **CoA seed**: ~20 akun standar yayasan masjid sesuai ISAK 35
- **Responsivitas**: Desktop-first approach, breakpoint utama di `md` (768px) dan `lg` (1024px)

