-- menu_item_images: restrict writes to authenticated only
DROP POLICY IF EXISTS "anon_insert_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_insert_menu_item_images" ON menu_item_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_update_menu_item_images" ON menu_item_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_item_images" ON menu_item_images;
CREATE POLICY "anon_delete_menu_item_images" ON menu_item_images FOR DELETE
  TO authenticated USING (true);

-- menu_item_ingredients: restrict writes to authenticated only
DROP POLICY IF EXISTS "anon_insert_menu_item_ingredients" ON menu_item_ingredients;
CREATE POLICY "anon_insert_menu_item_ingredients" ON menu_item_ingredients FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_menu_item_ingredients" ON menu_item_ingredients;
CREATE POLICY "anon_update_menu_item_ingredients" ON menu_item_ingredients FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_menu_item_ingredients" ON menu_item_ingredients;
CREATE POLICY "anon_delete_menu_item_ingredients" ON menu_item_ingredients FOR DELETE
  TO authenticated USING (true);

-- site_content: restrict writes to authenticated only
DROP POLICY IF EXISTS "insert_site_content" ON site_content;
CREATE POLICY "insert_site_content" ON site_content FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_site_content" ON site_content;
CREATE POLICY "update_site_content" ON site_content FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_site_content" ON site_content;
CREATE POLICY "delete_site_content" ON site_content FOR DELETE
  TO authenticated USING (true);

-- storage.objects: drop broad anon SELECT (public bucket URLs work without it)
DROP POLICY IF EXISTS "anon_select_menu_images" ON storage.objects;
CREATE POLICY "anon_select_menu_images" ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'menu-images');
