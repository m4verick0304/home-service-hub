
-- Add a permissive SELECT policy so helpers can see pending bookings
CREATE POLICY "Helpers can view pending bookings"
  ON public.bookings
  FOR SELECT
  USING (status = 'pending');

-- Add a permissive UPDATE policy so any authenticated user can accept pending bookings
CREATE POLICY "Authenticated users can update pending bookings"
  ON public.bookings
  FOR UPDATE
  USING (status = 'pending' AND auth.uid() IS NOT NULL);
