-- Seed services data
INSERT INTO public.services (name, description, category, icon, price_range) VALUES
  ('Home Cleaning', 'Professional house cleaning services', 'cleaning', 'sparkles', '₹500-₹2000'),
  ('Plumbing', 'Expert plumbers for all your plumbing needs', 'plumbing', 'wrench', '₹300-₹1500'),
  ('Electrical Work', 'Licensed electricians for installations and repairs', 'electrical', 'zap', '₹400-₹2000'),
  ('Cooking Services', 'Professional chefs for meal preparation', 'cooking', 'chef-hat', '₹1000-₹3000'),
  ('Painting', 'Interior and exterior painting services', 'painting', 'brush', '₹800-₹3000'),
  ('Carpentry', 'Expert carpenters for furniture and repairs', 'carpentry', 'hammer', '₹600-₹2500'),
  ('AC Service', 'Air conditioning installation and maintenance', 'ac-service', 'wind', '₹400-₹1500'),
  ('Pest Control', 'Professional pest management services', 'pest-control', 'bug', '₹500-₹2000')
ON CONFLICT DO NOTHING;
