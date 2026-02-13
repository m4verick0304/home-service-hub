-- Add INSERT policy for services (allow admin/anonymous inserts during setup)
CREATE POLICY "Services can be inserted during setup" ON public.services FOR INSERT WITH CHECK (true);
