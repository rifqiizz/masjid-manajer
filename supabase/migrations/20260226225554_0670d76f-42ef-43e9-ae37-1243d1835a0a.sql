
-- =============================================
-- 1. ENUM & ROLE SYSTEM
-- =============================================
CREATE TYPE public.app_role AS ENUM ('superadmin', 'ketua_dkm', 'sekretaris', 'bendahara', 'admin_konten');

-- User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. HELPER FUNCTIONS (SECURITY DEFINER)
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_bendahara_or_sekretaris(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('bendahara', 'sekretaris', 'superadmin')
  )
$$;

-- =============================================
-- 3. PROFILES TABLE
-- =============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 4. MOSQUE PROFILE (Settings)
-- =============================================
CREATE TABLE public.mosque_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Masjid Nuruzzaman',
  address text,
  phone text,
  email text,
  description text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.mosque_profile ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_mosque_profile_updated_at
  BEFORE UPDATE ON public.mosque_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 5. MASTER DATA: RUANGAN
-- =============================================
CREATE TABLE public.ruangan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity int,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ruangan ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_ruangan_updated_at
  BEFORE UPDATE ON public.ruangan
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 6. MASTER DATA: JAMAAH
-- =============================================
CREATE TABLE public.jamaah (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  address text,
  jenis_kelamin text CHECK (jenis_kelamin IN ('L', 'P')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.jamaah ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_jamaah_updated_at
  BEFORE UPDATE ON public.jamaah
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 7. RESERVASI
-- =============================================
CREATE TABLE public.reservasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.ruangan(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  organizer_name text NOT NULL,
  organizer_phone text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  purpose text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.reservasi ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_reservasi_updated_at
  BEFORE UPDATE ON public.reservasi
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 8. CHART OF ACCOUNTS (CoA)
-- =============================================
CREATE TABLE public.chart_of_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  account_type text NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_id uuid REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chart_of_accounts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_coa_updated_at
  BEFORE UPDATE ON public.chart_of_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 9. PEMASUKAN (Income)
-- =============================================
CREATE TABLE public.pemasukan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(15,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  coa_id uuid REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL,
  category text,
  reference_no text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pemasukan ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_pemasukan_updated_at
  BEFORE UPDATE ON public.pemasukan
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 10. PENGELUARAN (Expenses)
-- =============================================
CREATE TABLE public.pengeluaran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(15,2) NOT NULL CHECK (amount > 0),
  description text NOT NULL,
  coa_id uuid REFERENCES public.chart_of_accounts(id) ON DELETE SET NULL,
  category text,
  reference_no text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pengeluaran ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_pengeluaran_updated_at
  BEFORE UPDATE ON public.pengeluaran
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- 11. JOURNAL ENTRIES
-- =============================================
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  reference_no text,
  is_posted boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.journal_entry_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id uuid REFERENCES public.journal_entries(id) ON DELETE CASCADE NOT NULL,
  coa_id uuid REFERENCES public.chart_of_accounts(id) ON DELETE RESTRICT NOT NULL,
  debit numeric(15,2) NOT NULL DEFAULT 0,
  credit numeric(15,2) NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.journal_entry_lines ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 12. GENERAL LEDGER VIEW
-- =============================================
CREATE OR REPLACE VIEW public.general_ledger_view AS
SELECT
  jel.coa_id,
  coa.code AS coa_code,
  coa.name AS coa_name,
  coa.account_type,
  je.entry_date,
  je.description AS journal_description,
  je.reference_no,
  jel.debit,
  jel.credit,
  jel.description AS line_description,
  je.id AS journal_entry_id
FROM public.journal_entry_lines jel
JOIN public.journal_entries je ON je.id = jel.journal_entry_id
JOIN public.chart_of_accounts coa ON coa.id = jel.coa_id
WHERE je.is_posted = true;

-- =============================================
-- 13. RLS POLICIES
-- =============================================

-- user_roles
CREATE POLICY "Anyone authenticated can read roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmin can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Superadmin can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Superadmin can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'superadmin'));

-- profiles
CREATE POLICY "Anyone authenticated can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- mosque_profile
CREATE POLICY "Anyone authenticated can read mosque profile" ON public.mosque_profile FOR SELECT TO authenticated USING (true);
CREATE POLICY "Superadmin/Ketua can update mosque profile" ON public.mosque_profile FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'superadmin') OR public.has_role(auth.uid(), 'ketua_dkm'));

-- ruangan
CREATE POLICY "Anyone authenticated can read ruangan" ON public.ruangan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert ruangan" ON public.ruangan FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Roles can update ruangan" ON public.ruangan FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete ruangan" ON public.ruangan FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'superadmin'));

-- jamaah
CREATE POLICY "Anyone authenticated can read jamaah" ON public.jamaah FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert jamaah" ON public.jamaah FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Roles can update jamaah" ON public.jamaah FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete jamaah" ON public.jamaah FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'superadmin'));

-- reservasi
CREATE POLICY "Anyone authenticated can read reservasi" ON public.reservasi FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert reservasi" ON public.reservasi FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Roles can update reservasi" ON public.reservasi FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete reservasi" ON public.reservasi FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'superadmin'));

-- chart_of_accounts
CREATE POLICY "Anyone authenticated can read CoA" ON public.chart_of_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bendahara can insert CoA" ON public.chart_of_accounts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Bendahara can update CoA" ON public.chart_of_accounts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Bendahara can delete CoA" ON public.chart_of_accounts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));

-- pemasukan
CREATE POLICY "Anyone authenticated can read pemasukan" ON public.pemasukan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bendahara/Sekretaris can insert pemasukan" ON public.pemasukan FOR INSERT TO authenticated WITH CHECK (public.is_bendahara_or_sekretaris(auth.uid()));
CREATE POLICY "Bendahara/Sekretaris can update pemasukan" ON public.pemasukan FOR UPDATE TO authenticated USING (public.is_bendahara_or_sekretaris(auth.uid()));
CREATE POLICY "Bendahara/Sekretaris can delete pemasukan" ON public.pemasukan FOR DELETE TO authenticated USING (public.is_bendahara_or_sekretaris(auth.uid()));

-- pengeluaran
CREATE POLICY "Anyone authenticated can read pengeluaran" ON public.pengeluaran FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bendahara/Sekretaris can insert pengeluaran" ON public.pengeluaran FOR INSERT TO authenticated WITH CHECK (public.is_bendahara_or_sekretaris(auth.uid()));
CREATE POLICY "Bendahara/Sekretaris can update pengeluaran" ON public.pengeluaran FOR UPDATE TO authenticated USING (public.is_bendahara_or_sekretaris(auth.uid()));
CREATE POLICY "Bendahara/Sekretaris can delete pengeluaran" ON public.pengeluaran FOR DELETE TO authenticated USING (public.is_bendahara_or_sekretaris(auth.uid()));

-- journal_entries
CREATE POLICY "Anyone authenticated can read journal entries" ON public.journal_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bendahara can insert journal entries" ON public.journal_entries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Bendahara can update journal entries" ON public.journal_entries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Bendahara can delete journal entries" ON public.journal_entries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));

-- journal_entry_lines
CREATE POLICY "Anyone authenticated can read journal lines" ON public.journal_entry_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bendahara can insert journal lines" ON public.journal_entry_lines FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Bendahara can update journal lines" ON public.journal_entry_lines FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Bendahara can delete journal lines" ON public.journal_entry_lines FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'bendahara') OR public.has_role(auth.uid(), 'superadmin'));
