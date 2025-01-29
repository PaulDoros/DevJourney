-- Add new achievements for Supabase integration
DO $$
BEGIN
    -- Only insert if not exists
    IF NOT EXISTS (SELECT 1 FROM achievements WHERE name = 'Supabase Pioneer') THEN
        INSERT INTO achievements (name, description, points, category, icon)
        VALUES 
            ('Supabase Pioneer', 'Started exploring Supabase integration', 50, 'supabase', '🚀'),
            ('Database Master', 'Created and managed database tables', 100, 'supabase', '💾'),
            ('Auth Wizard', 'Implemented authentication features', 100, 'supabase', '🔐'),
            ('Real-time Expert', 'Used real-time subscriptions', 150, 'supabase', '⚡'),
            ('API Craftsman', 'Created custom API endpoints', 100, 'supabase', '🛠️'),
            ('Security Specialist', 'Implemented Row Level Security', 125, 'supabase', '🛡️'),
            ('Full-Stack Developer', 'Combined Remix with Supabase features', 200, 'supabase', '🏆'),
            ('Mobile Master', 'Optimized for mobile devices', 100, 'supabase', '📱');
    END IF;
END
$$; 