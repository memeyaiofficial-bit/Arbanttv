ALTER TABLE playlist_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "playlist_access_select_own" ON playlist_access
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "playlist_access_admin_all" ON playlist_access
    FOR ALL USING (auth.role() = 'admin');
