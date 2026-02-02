-- Create ENUM for conversation status IF NOT EXISTS (but Postgres doesn't support IF NOT EXISTS for TYPE easily, so we usually just create it or use text check)
-- Simplest is to use text constraint or try create type catching error.
-- We will use text check constraint for simplicity and robustness in migrations.

ALTER TABLE conversations 
ADD COLUMN status text DEFAULT 'ai' CHECK (status IN ('ai', 'waiting', 'active', 'closed')),
ADD COLUMN assigned_to uuid REFERENCES profiles(id),
ADD COLUMN unread_count integer DEFAULT 0;

-- Enable Realtime
-- Note: 'supabase_realtime' publication exists by default in Supabase projects.
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
