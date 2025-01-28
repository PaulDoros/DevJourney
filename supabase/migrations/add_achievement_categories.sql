-- Add category column to achievements table
ALTER TABLE achievements 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'uncategorized';

-- Update existing achievements with their categories
UPDATE achievements SET category = 'getting-started' 
WHERE name IN ('Welcome!', 'Theme Explorer', 'Avatar Customizer');

UPDATE achievements SET category = 'remix-features' 
WHERE name IN (
  'Remix Explorer',
  'Data Master',
  'Form Wizard',
  'Route Master',
  'Optimization Expert',
  'Type Safety Guardian'
);

UPDATE achievements SET category = 'themes' 
WHERE name IN ('Theme Master', 'Dark Side', 'Retro Lover', 'Multi Master');

UPDATE achievements SET category = 'avatars' 
WHERE name IN ('Avatar Collector', 'Custom Creator', 'Style Guru');

UPDATE achievements SET category = 'advanced' 
WHERE name IN (
  'Component Master',
  'Task Manager',
  'Code Warrior',
  'Documentation Reader',
  'Optimization Guru',
  'Error Handler',
  'Accessibility Champion',
  'TypeScript Pro'
);

-- Add category display names
CREATE TABLE achievement_categories (
  id VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO achievement_categories (id, display_name, sort_order) VALUES
('getting-started', 'Getting Started', 1),
('remix-features', 'Remix Features', 2),
('themes', 'Theme Mastery', 3),
('avatars', 'Avatar Collection', 4),
('advanced', 'Advanced Skills', 5);

-- Add foreign key constraint
ALTER TABLE achievements
ADD CONSTRAINT fk_achievement_category
FOREIGN KEY (category) REFERENCES achievement_categories(id); 