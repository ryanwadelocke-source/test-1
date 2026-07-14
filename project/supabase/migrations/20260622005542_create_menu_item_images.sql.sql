/*
# Create menu_item_images table for item photos

1. New Tables
- `menu_item_images`
  - `id` (uuid, primary key)
  - `item_id` (text, unique, not null) - matches the menu item name/key
  - `image_url` (text, not null) - URL to the uploaded image in storage
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

2. Storage Bucket
- Creates `menu-images` bucket if it doesn't exist for storing item photos

3. Security
- Enable RLS on `menu_item_images`.
- Allow anon + authenticated CRUD (single-tenant, no auth required).
- Storage bucket is public for reading.

4. Notes
- Images are linked to menu items by their name (item_id).
- Only one image per item (unique constraint).
- The image_url stores the full public URL from Supabase storage.
*/

CREATE TABLE IF NOT EXISTS menu_item_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id text UNIQUE NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE menu_item_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_select_menu_item_images" ON menu_item_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_insert_menu_item_images" ON menu_item_images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_update_menu_item_images" ON menu_item_images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_delete_menu_item_images" ON menu_item_images FOR DELETE
  TO anon, authenticated USING (true);

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public read
DROP POLICY IF EXISTS "anon_select_menu_images" ON storage.objects;
CREATE POLICY "anon_select_menu_images" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "anon_insert_menu_images" ON storage.objects;
CREATE POLICY "anon_insert_menu_images" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "anon_update_menu_images" ON storage.objects;
CREATE POLICY "anon_update_menu_images" ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'menu-images') WITH CHECK (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "anon_delete_menu_images" ON storage.objects;
CREATE POLICY "anon_delete_menu_images" ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'menu-images');
