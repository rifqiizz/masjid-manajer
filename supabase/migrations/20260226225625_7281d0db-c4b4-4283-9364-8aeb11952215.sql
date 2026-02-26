
-- Fix 1: Change general_ledger_view to SECURITY INVOKER (default, but explicit)
DROP VIEW IF EXISTS public.general_ledger_view;
CREATE VIEW public.general_ledger_view WITH (security_invoker = true) AS
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

-- Fix 2: Replace overly permissive schedule_events policies with role-based ones
DROP POLICY IF EXISTS "Anyone can delete schedule events" ON public.schedule_events;
DROP POLICY IF EXISTS "Anyone can insert schedule events" ON public.schedule_events;
DROP POLICY IF EXISTS "Anyone can read schedule events" ON public.schedule_events;
DROP POLICY IF EXISTS "Anyone can update schedule events" ON public.schedule_events;

CREATE POLICY "Authenticated can read schedule events" ON public.schedule_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Roles can insert schedule events" ON public.schedule_events FOR INSERT TO authenticated WITH CHECK (public.has_any_role(auth.uid()));
CREATE POLICY "Roles can update schedule events" ON public.schedule_events FOR UPDATE TO authenticated USING (public.has_any_role(auth.uid()));
CREATE POLICY "Superadmin can delete schedule events" ON public.schedule_events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'superadmin'));
