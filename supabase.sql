-- Add remaining RLS policies

-- Spaces table policies
CREATE POLICY "Users can view spaces for their quotes"
    ON public.spaces
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quotes
            WHERE quotes.id = spaces.quote_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' IN ('admin', 'sales'))
        )
    );

CREATE POLICY "Admin and sales can create spaces"
    ON public.spaces
    FOR INSERT
    WITH CHECK (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM quotes
            WHERE quotes.id = quote_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

CREATE POLICY "Admin and sales can update spaces"
    ON public.spaces
    FOR UPDATE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM quotes
            WHERE quotes.id = quote_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

CREATE POLICY "Admin and sales can delete spaces"
    ON public.spaces
    FOR DELETE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM quotes
            WHERE quotes.id = quote_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

-- Items table policies
CREATE POLICY "Users can view items"
    ON public.items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM spaces
            JOIN quotes ON quotes.id = spaces.quote_id
            WHERE spaces.id = items.space_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' IN ('admin', 'sales'))
        )
    );

CREATE POLICY "Admin and sales can create items"
    ON public.items
    FOR INSERT
    WITH CHECK (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM spaces
            JOIN quotes ON quotes.id = spaces.quote_id
            WHERE spaces.id = space_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

CREATE POLICY "Admin and sales can update items"
    ON public.items
    FOR UPDATE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM spaces
            JOIN quotes ON quotes.id = spaces.quote_id
            WHERE spaces.id = space_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

CREATE POLICY "Admin and sales can delete items"
    ON public.items
    FOR DELETE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM spaces
            JOIN quotes ON quotes.id = spaces.quote_id
            WHERE spaces.id = space_id
            AND (quotes.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

-- Orders table policies
CREATE POLICY "Users can view their orders"
    ON public.orders
    FOR SELECT
    USING (
        user_id = auth.uid() OR auth.jwt()->>'role' IN ('admin', 'sales')
    );

CREATE POLICY "Admin and sales can create orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (
        auth.jwt()->>'role' IN ('admin', 'sales')
    );

CREATE POLICY "Admin and sales can update orders"
    ON public.orders
    FOR UPDATE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales')
    );

CREATE POLICY "Admin and sales can delete orders"
    ON public.orders
    FOR DELETE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales')
    );

-- Receipts table policies
CREATE POLICY "Users can view receipts"
    ON public.receipts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = receipts.order_id
            AND (orders.user_id = auth.uid() OR auth.jwt()->>'role' IN ('admin', 'sales'))
        )
    );

CREATE POLICY "Admin and sales can create receipts"
    ON public.receipts
    FOR INSERT
    WITH CHECK (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_id
            AND (orders.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

CREATE POLICY "Admin and sales can update receipts"
    ON public.receipts
    FOR UPDATE
    USING (
        auth.jwt()->>'role' IN ('admin', 'sales') AND
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_id
            AND (orders.user_id = auth.uid() OR auth.jwt()->>'role' = 'admin')
        )
    );

-- Categories table policies
CREATE POLICY "Everyone can view categories"
    ON public.categories
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admin can modify categories"
    ON public.categories
    FOR ALL
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Products table policies
CREATE POLICY "Everyone can view products"
    ON public.products
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admin can modify products"
    ON public.products
    FOR ALL
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Materials table policies
CREATE POLICY "Everyone can view materials"
    ON public.materials
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admin can modify materials"
    ON public.materials
    FOR ALL
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');

-- Product materials table policies
CREATE POLICY "Everyone can view product materials"
    ON public.product_materials
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admin can modify product materials"
    ON public.product_materials
    FOR ALL
    USING (auth.jwt()->>'role' = 'admin')
    WITH CHECK (auth.jwt()->>'role' = 'admin');