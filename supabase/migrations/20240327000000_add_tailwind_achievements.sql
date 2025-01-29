-- Create enum type for achievement categories if it doesn't exist
DO $$ BEGIN
  CREATE TYPE achievement_category AS ENUM ('supabase', 'tailwind', 'remix', 'typescript');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  category achievement_category NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create function to increment points
CREATE OR REPLACE FUNCTION increment_points(user_row users, amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN COALESCE(user_row.points, 0) + amount;
END;
$$ LANGUAGE plpgsql;

-- Create function to append to array
CREATE OR REPLACE FUNCTION array_append(arr UUID[], item UUID)
RETURNS UUID[] AS $$
BEGIN
  RETURN array_append(COALESCE(arr, ARRAY[]::UUID[]), item);
END;
$$ LANGUAGE plpgsql;

-- Insert Tailwind achievements if they don't exist
INSERT INTO achievements (name, description, points, category, icon)
VALUES
  ('Tailwind Explorer', 'Started exploring Tailwind CSS customization', 50, 'tailwind', 'sparkles'),
  ('Style Master', 'Created a custom component with advanced Tailwind classes', 100, 'tailwind', 'palette'),
  ('Layout Wizard', 'Successfully implemented responsive layouts', 75, 'tailwind', 'template'),
  ('Animation Artist', 'Added smooth animations using Tailwind', 100, 'tailwind', 'cursor-click'),
  ('Theme Creator', 'Created a custom color scheme', 125, 'tailwind', 'swatch'),
  ('Mobile Master', 'Optimized design for mobile devices', 100, 'tailwind', 'device-mobile'),
  ('Design System Pro', 'Created a consistent design system', 150, 'tailwind', 'puzzle')
ON CONFLICT (name) DO NOTHING;

-- Insert Supabase achievements if they don't exist
INSERT INTO achievements (name, description, points, category, icon)
VALUES
  ('Supabase Pioneer', 'Started exploring Supabase integration', 50, 'supabase', 'database'),
  ('Database Master', 'Successfully managed database tables', 100, 'supabase', 'table'),
  ('Auth Wizard', 'Implemented authentication features', 100, 'supabase', 'key'),
  ('Real-time Expert', 'Used real-time subscriptions', 150, 'supabase', 'bolt'),
  ('API Craftsman', 'Created custom API endpoints', 100, 'supabase', 'code'),
  ('Security Specialist', 'Implemented Row Level Security', 125, 'supabase', 'shield-check'),
  ('Full-Stack Developer', 'Combined Remix with Supabase features', 200, 'supabase', 'code-bracket'),
  ('Mobile Master', 'Optimized for mobile devices', 100, 'supabase', 'device-phone-mobile')
ON CONFLICT (name) DO NOTHING;

-- Create or replace trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to achievements table
DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to user_achievements table
DROP TRIGGER IF EXISTS update_user_achievements_updated_at ON user_achievements;
CREATE TRIGGER update_user_achievements_updated_at
  BEFORE UPDATE ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are readable by all authenticated users
CREATE POLICY "Achievements are readable by all authenticated users"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements are readable by the user who earned them
CREATE POLICY "User achievements are readable by the user who earned them"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User achievements can only be inserted by the user earning them
CREATE POLICY "User achievements can only be inserted by the user earning them"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id); 