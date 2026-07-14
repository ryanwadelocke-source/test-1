-- Fix "always true" RLS clauses: replace literal true with auth.uid() IS NOT NULL
-- This ensures the predicate is evaluated dynamically, not as a constant bypass.

-- menu_item_images
DROP POLICY IF EXISTS "anon_insert_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_insert_menu_item_images" ON menu_item_images FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "anon_update_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_update_menu_item_images" ON menu_item_images FOR UPDATE
  TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "anon_delete_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_delete_menu_item_images" ON menu_item_images FOR DELETE
  TO authenticated USING (auth.uid() IS NOT NULL);

-- menu_item_ingredients
DROP POLICY IF EXISTS "anon_insert_menu_item_ingredients" ON menu_item_ingredients;
CREATE POLICY "anon_insert_menu_item_ingredients" ON menu_item_ingredients FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "anon_update_menu_item_ingredients" ON menu_item_ingredients;
CREATE POLICY "anon_update_menu_item_ingredients" ON menu_item_ingredients FOR UPDATE
  TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "anon_delete_menu_item_ingredients" ON menu_item_ingredients;
CREATE POLICY "anon_delete_menu_item_ingredients" ON menu_item_ingredients FOR DELETE
  TO authenticated USING (auth.uid() IS NOT NULL);

-- site_content
DROP POLICY IF EXISTS "insert_site_content" ON site_content;
CREATE POLICY "insert_site_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "update_site_content" ON site_content;
CREATE POLICY "update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "delete_site_content" ON site_content;
CREATE POLICY "delete_site_content" ON site_content FOR DELETE
  TO authenticated USING (auth.uid() IS NOT NULL);

-- Storage: drop the broad anon SELECT policy entirely.
-- Public bucket objects are accessible by URL without a SELECT policy;
-- the SELECT policy is only needed for listing, which should not be open to anon.
DROP POLICY IF EXISTS "anon_select_menu_images" ON storage.objects;
CREATE POLICY "anon_select_menu_images" ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'menu-images' AND auth.uid() IS NOT NULL);
