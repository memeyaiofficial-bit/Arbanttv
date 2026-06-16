ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "playlists_public_select" ON playlists
    FOR SELECT USING (true);

CREATE POLICY "playlists_insert_own" ON playlists
    FOR INSERT WITH CHECK (auth.uid()::text = creator_id);

CREATE POLICY "playlists_update_own" ON playlists
    FOR UPDATE USING (auth.uid()::text = creator_id);

CREATE POLICY "playlists_delete_own" ON playlists
    FOR DELETE USING (auth.uid()::text = creator_id);
