ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "users_update_own" ON users
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "users_delete_own" ON users
    FOR DELETE USING (auth.uid()::text = id);

CREATE POLICY "users_insert_auth" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id);
