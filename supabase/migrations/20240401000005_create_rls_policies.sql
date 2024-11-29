-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_settings ENABLE ROW LEVEL SECURITY;

-- Admin policies (can do everything)
CREATE POLICY "Admin full access" ON users FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON categories FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON materials FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON products FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON product_materials FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON quotes FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON spaces FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON items FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON orders FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON receipts FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON preset_values FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admin full access" ON template_settings FOR ALL USING (auth.jwt()->>'role' = 'admin');

-- Sales policies for read-only access
CREATE POLICY "Sales read access" ON categories FOR SELECT USING (auth.jwt()->>'role' = 'sales');
CREATE POLICY "Sales read access" ON materials FOR SELECT USING (auth.jwt()->>'role' = 'sales');
CREATE POLICY "Sales read access" ON products FOR SELECT USING (auth.jwt()->>'role' = 'sales');
CREATE POLICY "Sales read access" ON product_materials FOR SELECT USING (auth.jwt()->>'role' = 'sales');
CREATE POLICY "Sales read access" ON preset_values FOR SELECT USING (auth.jwt()->>'role' = 'sales');
CREATE POLICY "Sales read access" ON template_settings FOR SELECT USING (auth.jwt()->>'role' = 'sales');

-- Sales quotes policies
CREATE POLICY "Sales quotes select" ON quotes 
  FOR SELECT 
  USING (auth.jwt()->>'role' = 'sales');

CREATE POLICY "Sales quotes insert" ON quotes 
  FOR INSERT 
  WITH CHECK (
    auth.jwt()->>'role' = 'sales' AND 
    auth.uid() = created_by
  );

CREATE POLICY "Sales quotes update" ON quotes 
  FOR UPDATE 
  USING (auth.jwt()->>'role' = 'sales');

-- Sales spaces and items policies
CREATE POLICY "Sales spaces access" ON spaces 
  FOR ALL 
  USING (
    auth.jwt()->>'role' = 'sales' AND
    EXISTS (
      SELECT 1 FROM quotes 
      WHERE quotes.id = spaces.quote_id
    )
  );

CREATE POLICY "Sales items access" ON items 
  FOR ALL 
  USING (
    auth.jwt()->>'role' = 'sales' AND
    EXISTS (
      SELECT 1 FROM spaces 
      WHERE spaces.id = items.space_id
    )
  );

-- Sales orders policies
CREATE POLICY "Sales orders select" ON orders 
  FOR SELECT 
  USING (auth.jwt()->>'role' = 'sales');

CREATE POLICY "Sales orders insert" ON orders 
  FOR INSERT 
  WITH CHECK (
    auth.jwt()->>'role' = 'sales' AND 
    auth.uid() = created_by
  );

CREATE POLICY "Sales orders update" ON orders 
  FOR UPDATE 
  USING (auth.jwt()->>'role' = 'sales');

CREATE POLICY "Sales receipts access" ON receipts 
  FOR ALL 
  USING (
    auth.jwt()->>'role' = 'sales' AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = receipts.order_id
    )
  );

-- Public access policies (for client views)
CREATE POLICY "Public quote view" ON quotes 
  FOR SELECT 
  USING (
    status IN ('approved', 'pending')
  );

CREATE POLICY "Public order view" ON orders
  FOR SELECT
  USING (
    quote_id IS NOT NULL AND
    status != 'cancelled'
  );

CREATE POLICY "Public receipt view" ON receipts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = receipts.order_id
      AND orders.status != 'cancelled'
    )
  );

CREATE POLICY "Public template view" ON template_settings
  FOR SELECT
  USING (true);

-- Authenticated user policies
CREATE POLICY "Authenticated users access" ON categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users access" ON materials FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users access" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users access" ON product_materials FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users access" ON preset_values FOR SELECT USING (auth.role() = 'authenticated');