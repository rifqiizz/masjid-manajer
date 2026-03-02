
-- =============================================
-- BATCH 1: Full Database Schema Migration
-- =============================================

-- 1. New enums
CREATE TYPE public.room_type AS ENUM ('bookable', 'non_bookable');
CREATE TYPE public.kegiatan_status AS ENUM ('dijadwalkan', 'berlangsung', 'selesai', 'dibatalkan');
CREATE TYPE public.kondisi_aset AS ENUM ('baik', 'rusak_ringan', 'rusak_berat', 'dalam_perbaikan');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.task_column AS ENUM ('backlog', 'todo', 'in_progress', 'done');

-- 2A. Update ruangan table
ALTER TABLE public.ruangan
  ADD COLUMN IF NOT EXISTS type room_type NOT NULL DEFAULT 'bookable',
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS price numeric,
  ADD COLUMN IF NOT EXISTS rules text,
  ADD COLUMN IF NOT EXISTS facilities_info text;

-- 2B. ruangan_gallery
CREATE TABLE public.ruangan_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ruangan_id uuid NOT NULL REFERENCES public.ruangan(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ruangan_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read ruangan gallery" ON public.ruangan_gallery FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert ruangan gallery" ON public.ruangan_gallery FOR INSERT TO authenticated WITH CHECK (has_any_role(auth.uid()));
CREATE POLICY "Roles can update ruangan gallery" ON public.ruangan_gallery FOR UPDATE TO authenticated USING (has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete ruangan gallery" ON public.ruangan_gallery FOR DELETE TO authenticated USING (has_role(auth.uid(), 'superadmin'));

-- 2C. mosque_gallery
CREATE TABLE public.mosque_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_profile_id uuid NOT NULL REFERENCES public.mosque_profile(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mosque_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read mosque gallery" ON public.mosque_gallery FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmin/Ketua can insert mosque gallery" ON public.mosque_gallery FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'superadmin') OR has_role(auth.uid(), 'ketua_dkm'));
CREATE POLICY "Superadmin/Ketua can update mosque gallery" ON public.mosque_gallery FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'superadmin') OR has_role(auth.uid(), 'ketua_dkm'));
CREATE POLICY "Superadmin/Ketua can delete mosque gallery" ON public.mosque_gallery FOR DELETE TO authenticated USING (has_role(auth.uid(), 'superadmin') OR has_role(auth.uid(), 'ketua_dkm'));

-- 2D. Update mosque_profile
ALTER TABLE public.mosque_profile
  ADD COLUMN IF NOT EXISTS tahun_berdiri integer,
  ADD COLUMN IF NOT EXISTS luas_bangunan text,
  ADD COLUMN IF NOT EXISTS kapasitas_jamaah integer,
  ADD COLUMN IF NOT EXISTS jam_operasional text;

-- 2E. website_sections
CREATE TABLE public.website_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  title text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  config_json jsonb DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.website_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read website sections" ON public.website_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmin/Ketua can manage website sections" ON public.website_sections FOR ALL TO authenticated USING (has_role(auth.uid(), 'superadmin') OR has_role(auth.uid(), 'ketua_dkm'));

-- Seed website sections
INSERT INTO public.website_sections (section_key, title, sort_order) VALUES
  ('hero', 'Hero — Jadwal Sholat & CTA', 1),
  ('momentum', 'Momentum — Menyambut Ramadhan', 2),
  ('berita', 'Berita — Bento Grid', 3),
  ('kajian', 'Kajian — Jadwal Kajian', 4),
  ('activities', 'Activities — Kegiatan Masjid', 5),
  ('articles', 'Articles — Artikel & Nasihat', 6),
  ('facilities', 'Facilities — Fasilitas Masjid', 7),
  ('room_rental', 'Room Rental — Pemanfaatan Ruang', 8),
  ('finance', 'Finance — Transparansi Keuangan', 9),
  ('instagram_feed', 'Instagram Feed — Embed Instagram', 10);

-- 2F. kegiatan
CREATE TABLE public.kegiatan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  deskripsi text,
  tanggal date NOT NULL,
  waktu_mulai timestamptz NOT NULL,
  waktu_selesai timestamptz NOT NULL,
  room_id uuid REFERENCES public.ruangan(id),
  penanggung_jawab text,
  status kegiatan_status NOT NULL DEFAULT 'dijadwalkan',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.kegiatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read kegiatan" ON public.kegiatan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert kegiatan" ON public.kegiatan FOR INSERT TO authenticated WITH CHECK (has_any_role(auth.uid()));
CREATE POLICY "Roles can update kegiatan" ON public.kegiatan FOR UPDATE TO authenticated USING (has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete kegiatan" ON public.kegiatan FOR DELETE TO authenticated USING (has_role(auth.uid(), 'superadmin'));

CREATE TRIGGER set_kegiatan_updated_at BEFORE UPDATE ON public.kegiatan FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2G. fasilitas (asset management)
CREATE TABLE public.fasilitas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  kategori text,
  ruangan_id uuid REFERENCES public.ruangan(id),
  kondisi kondisi_aset NOT NULL DEFAULT 'baik',
  is_active boolean NOT NULL DEFAULT true,
  tanggal_perawatan date,
  catatan_perawatan text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.fasilitas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read fasilitas" ON public.fasilitas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert fasilitas" ON public.fasilitas FOR INSERT TO authenticated WITH CHECK (has_any_role(auth.uid()));
CREATE POLICY "Roles can update fasilitas" ON public.fasilitas FOR UPDATE TO authenticated USING (has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete fasilitas" ON public.fasilitas FOR DELETE TO authenticated USING (has_role(auth.uid(), 'superadmin'));

CREATE TRIGGER set_fasilitas_updated_at BEFORE UPDATE ON public.fasilitas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2H. tugas (kanban)
CREATE TABLE public.tugas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  priority task_priority NOT NULL DEFAULT 'medium',
  column_id task_column NOT NULL DEFAULT 'backlog',
  assignee_id uuid REFERENCES public.profiles(id),
  labels text[] DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tugas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read tugas" ON public.tugas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert tugas" ON public.tugas FOR INSERT TO authenticated WITH CHECK (has_any_role(auth.uid()));
CREATE POLICY "Roles can update tugas" ON public.tugas FOR UPDATE TO authenticated USING (has_any_role(auth.uid()));
CREATE POLICY "Roles can delete tugas" ON public.tugas FOR DELETE TO authenticated USING (has_any_role(auth.uid()));

CREATE TRIGGER set_tugas_updated_at BEFORE UPDATE ON public.tugas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2I. audit_logs
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  module text NOT NULL,
  detail text,
  ip_address text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);

-- Security definer function for inserting audit logs (bypasses RLS)
CREATE OR REPLACE FUNCTION public.log_audit(
  _user_id uuid,
  _action text,
  _module text,
  _detail text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, module, detail, metadata)
  VALUES (_user_id, _action, _module, _detail, _metadata);
END;
$$;

-- 2J. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('mosque-gallery', 'mosque-gallery', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('ruangan-gallery', 'ruangan-gallery', true);

-- Storage policies for mosque-gallery
CREATE POLICY "Public can view mosque gallery" ON storage.objects FOR SELECT USING (bucket_id = 'mosque-gallery');
CREATE POLICY "Authenticated can upload mosque gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'mosque-gallery' AND has_any_role(auth.uid()));
CREATE POLICY "Authenticated can update mosque gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'mosque-gallery' AND has_any_role(auth.uid()));
CREATE POLICY "Authenticated can delete mosque gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'mosque-gallery' AND has_any_role(auth.uid()));

-- Storage policies for ruangan-gallery
CREATE POLICY "Public can view ruangan gallery" ON storage.objects FOR SELECT USING (bucket_id = 'ruangan-gallery');
CREATE POLICY "Authenticated can upload ruangan gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ruangan-gallery' AND has_any_role(auth.uid()));
CREATE POLICY "Authenticated can update ruangan gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ruangan-gallery' AND has_any_role(auth.uid()));
CREATE POLICY "Authenticated can delete ruangan gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ruangan-gallery' AND has_any_role(auth.uid()));

-- Trigger for website_sections updated_at
CREATE TRIGGER set_website_sections_updated_at BEFORE UPDATE ON public.website_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
