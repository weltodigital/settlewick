-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('agent-logos', 'agent-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']),
  ('floorplans', 'floorplans', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

-- Storage policies for property-images bucket
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own property images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'property-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own property images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'property-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for agent-logos bucket
CREATE POLICY "Anyone can view agent logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'agent-logos');

CREATE POLICY "Authenticated users can upload agent logos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'agent-logos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own agent logos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'agent-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own agent logos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'agent-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for floorplans bucket
CREATE POLICY "Anyone can view floorplans" ON storage.objects
  FOR SELECT USING (bucket_id = 'floorplans');

CREATE POLICY "Authenticated users can upload floorplans" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'floorplans'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own floorplans" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'floorplans'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own floorplans" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'floorplans'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );