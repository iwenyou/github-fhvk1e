-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Sales quotes insert" ON quotes;
DROP POLICY IF EXISTS "Sales quotes update" ON quotes;
DROP POLICY IF EXISTS "Sales orders insert" ON orders;
DROP POLICY IF EXISTS "Sales orders update" ON orders;

-- Fix quotes policies for sales users
CREATE POLICY "Sales quotes insert" ON quotes 
  FOR INSERT 
  WITH CHECK (
    auth.jwt()->>'role' = 'sales' AND 
    auth.uid() = user_id AND
    auth.uid() = created_by
  );

CREATE POLICY "Sales quotes update" ON quotes 
  FOR UPDATE 
  USING (
    auth.jwt()->>'role' = 'sales' AND
    (auth.uid() = user_id OR auth.uid() = created_by)
  );

-- Fix orders policies for sales users
CREATE POLICY "Sales orders insert" ON orders 
  FOR INSERT 
  WITH CHECK (
    auth.jwt()->>'role' = 'sales' AND 
    auth.uid() = user_id AND
    auth.uid() = created_by
  );

CREATE POLICY "Sales orders update" ON orders 
  FOR UPDATE 
  USING (
    auth.jwt()->>'role' = 'sales' AND
    (auth.uid() = user_id OR auth.uid() = created_by)
  );

-- Add helper function to verify user role
CREATE OR REPLACE FUNCTION verify_user_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND (
        raw_user_meta_data->>'role' = required_role
        OR 
        raw_user_meta_data->>'role' = 'admin'
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to verify quote access
CREATE OR REPLACE FUNCTION can_access_quote(quote_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM quotes q
      WHERE q.id = quote_id
      AND (
        q.user_id = auth.uid()
        OR q.created_by = auth.uid()
        OR verify_user_role('admin')
        OR (
          verify_user_role('sales')
          AND q.status NOT IN ('cancelled', 'rejected')
        )
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to verify order access
CREATE OR REPLACE FUNCTION can_access_order(order_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_id
      AND (
        o.user_id = auth.uid()
        OR o.created_by = auth.uid()
        OR verify_user_role('admin')
        OR (
          verify_user_role('sales')
          AND o.status != 'cancelled'
        )
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION verify_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_quote TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_order TO authenticated;

-- Update spaces policies to use access functions
CREATE POLICY "Spaces access" ON spaces
  FOR ALL
  USING (can_access_quote(quote_id));

-- Update items policies to use access functions
CREATE POLICY "Items access" ON items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM spaces s
      WHERE s.id = space_id
      AND can_access_quote(s.quote_id)
    )
  );

-- Update receipts policies to use access functions
CREATE POLICY "Receipts access" ON receipts
  FOR ALL
  USING (can_access_order(order_id));