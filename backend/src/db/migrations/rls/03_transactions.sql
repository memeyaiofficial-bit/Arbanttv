ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_select_own" ON transactions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "transactions_insert_own" ON transactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "transactions_admin_all" ON transactions
    FOR ALL USING (auth.role() = 'admin');
