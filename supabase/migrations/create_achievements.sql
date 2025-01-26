-- Drop and recreate preset_avatars table
drop table if exists preset_avatars cascade;
create table preset_avatars (
  id text primary key,
  name text not null,
  type varchar not null check (type in ('static', 'lottie')),
  url text not null,
  preview text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drop and recreate achievements table
drop table if exists achievements cascade;
create table achievements (
  id uuid default uuid_generate_v4() primary key,
  name varchar not null,
  description text not null,
  points integer not null default 0,
  icon_url text,
  preset_avatar_id text references preset_avatars(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Drop and recreate user_achievements table
drop table if exists user_achievements cascade;
create table user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  achievement_id uuid references achievements not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Create avatars table
create table avatars (
  id uuid default uuid_generate_v4() primary key,
  name varchar not null,
  type varchar not null check (type in ('static', 'lottie')),
  url text not null,
  achievement_id uuid references achievements,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert preset avatars
insert into preset_avatars (id, name, type, url, preview) values
('basic-1', 'Basic Avatar 1', 'static', 'url-to-avatar-1', 'preview-url-1'),
('theme-1', 'Theme Master Avatar', 'lottie', 'url-to-avatar-2', 'preview-url-2'),
('collector-1', 'Collector Special', 'lottie', 'url-to-avatar-3', 'preview-url-3');

-- Insert achievements
insert into achievements (name, description, points) values
-- Basic Achievements
('Welcome!', 'Created your account and joined the journey', 100),
('Theme Explorer', 'Changed your theme for the first time', 50),
('Avatar Customizer', 'Customized your profile avatar', 75),

-- Theme Achievements
('Theme Master', 'Try all available themes', 150),
('Dark Side', 'Use dark theme for an extended period', 50),
('Retro Lover', 'Use retro theme for an extended period', 50),
('Multi Master', 'Use multi theme for an extended period', 50),

-- Avatar Achievements
('Avatar Collector', 'Unlock 5 different avatars', 200),
('Custom Creator', 'Upload a custom avatar', 100),
('Style Guru', 'Change avatars 10 times', 150),

-- Engagement Achievements
('Profile Perfectionist', 'Complete your profile information', 100),
('Early Bird', 'Login 5 days in a row', 200),
('Active Explorer', 'Visit all main sections', 150),
('Social Butterfly', 'Connect with 5 other developers', 200);

-- Link avatars to achievements
update achievements 
set preset_avatar_id = 'theme-1' 
where name = 'Theme Master';

update achievements 
set preset_avatar_id = 'collector-1' 
where name = 'Avatar Collector'; 