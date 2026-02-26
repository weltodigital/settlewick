-- Enable Row Level Security on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE hidden_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE sold_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE area_guides ENABLE ROW LEVEL SECURITY;

-- Agents table policies
CREATE POLICY "Agents are viewable by everyone" ON agents
    FOR SELECT USING (true);

CREATE POLICY "Agents can update their own profile" ON agents
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT p.id FROM profiles p WHERE p.agent_id = agents.id
        )
    );

CREATE POLICY "Only admins can insert agents" ON agents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete agents" ON agents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Profiles table policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Only admins can delete profiles" ON profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Properties table policies
CREATE POLICY "Available properties are viewable by everyone" ON properties
    FOR SELECT USING (status = 'available');

CREATE POLICY "All properties are viewable by admins" ON properties
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can view their own properties" ON properties
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.agent_id = properties.agent_id
        )
    );

CREATE POLICY "Agents can insert properties for their agency" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.agent_id = properties.agent_id
            AND p.role = 'agent'
        )
    );

CREATE POLICY "Agents can update their own properties" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.agent_id = properties.agent_id
        )
    );

CREATE POLICY "Admins can update any property" ON properties
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can delete their own properties" ON properties
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.agent_id = properties.agent_id
        )
    );

CREATE POLICY "Admins can delete any property" ON properties
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Property images table policies
CREATE POLICY "Property images are viewable by everyone" ON property_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties p
            WHERE p.id = property_images.property_id
            AND p.status = 'available'
        )
    );

CREATE POLICY "All property images are viewable by admins" ON property_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can view images of their own properties" ON property_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties p
            JOIN profiles pr ON pr.agent_id = p.agent_id
            WHERE p.id = property_images.property_id
            AND pr.id = auth.uid()
        )
    );

CREATE POLICY "Agents can manage images of their own properties" ON property_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties p
            JOIN profiles pr ON pr.agent_id = p.agent_id
            WHERE p.id = property_images.property_id
            AND pr.id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage any property image" ON property_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Property price history table policies
CREATE POLICY "Price history is viewable by everyone" ON property_price_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties p
            WHERE p.id = property_price_history.property_id
            AND p.status = 'available'
        )
    );

CREATE POLICY "All price history is viewable by admins" ON property_price_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Agents can manage price history of their properties" ON property_price_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties p
            JOIN profiles pr ON pr.agent_id = p.agent_id
            WHERE p.id = property_price_history.property_id
            AND pr.id = auth.uid()
        )
    );

-- Saved properties table policies
CREATE POLICY "Users can view their own saved properties" ON saved_properties
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved properties" ON saved_properties
    FOR ALL USING (auth.uid() = user_id);

-- Hidden properties table policies
CREATE POLICY "Users can view their own hidden properties" ON hidden_properties
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own hidden properties" ON hidden_properties
    FOR ALL USING (auth.uid() = user_id);

-- Saved searches table policies
CREATE POLICY "Users can view their own saved searches" ON saved_searches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved searches" ON saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- Property enquiries table policies
CREATE POLICY "Agents can view enquiries for their properties" ON property_enquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.agent_id = property_enquiries.agent_id
        )
    );

CREATE POLICY "Admins can view all enquiries" ON property_enquiries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view their own enquiries" ON property_enquiries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create enquiries" ON property_enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can update enquiries for their properties" ON property_enquiries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.agent_id = property_enquiries.agent_id
        )
    );

CREATE POLICY "Admins can manage any enquiry" ON property_enquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Property views table policies (for analytics)
CREATE POLICY "Anyone can create property views" ON property_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can view analytics for their properties" ON property_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM properties p
            JOIN profiles pr ON pr.agent_id = p.agent_id
            WHERE p.id = property_views.property_id
            AND pr.id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all property views" ON property_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Sold prices table policies
CREATE POLICY "Sold prices are viewable by everyone" ON sold_prices
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage sold prices" ON sold_prices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Area guides table policies
CREATE POLICY "Area guides are viewable by everyone" ON area_guides
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage area guides" ON area_guides
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );