CREATE TABLE site_content (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_site_content" ON site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_site_content" ON site_content FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_site_content" ON site_content FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_site_content" ON site_content FOR DELETE TO anon, authenticated USING (true);
