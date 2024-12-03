-- Add position to players
ALTER TABLE players ADD COLUMN IF NOT EXISTS position text;

-- Add notes to practices
ALTER TABLE practices ADD COLUMN IF NOT EXISTS notes text;

-- Add status to practice_attendance and update existing records
ALTER TABLE practice_attendance ADD COLUMN IF NOT EXISTS status text;
UPDATE practice_attendance SET status = 'present' WHERE status IS NULL;
ALTER TABLE practice_attendance ALTER COLUMN status SET NOT NULL;
ALTER TABLE practice_attendance ADD CONSTRAINT practice_attendance_status_check 
  CHECK (status IN ('present', 'absent'));

-- Add venue and coach to matches
ALTER TABLE matches ADD COLUMN IF NOT EXISTS venue text;
ALTER TABLE matches ADD COLUMN IF NOT EXISTS coach text;

-- Add position and status to match_participation and update existing records
ALTER TABLE match_participation ADD COLUMN IF NOT EXISTS position text;
ALTER TABLE match_participation ADD COLUMN IF NOT EXISTS status text;
UPDATE match_participation SET status = 'played' WHERE status IS NULL;
ALTER TABLE match_participation ALTER COLUMN status SET NOT NULL;
ALTER TABLE match_participation ADD CONSTRAINT match_participation_status_check 
  CHECK (status IN ('played', 'absent'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_players_full_name ON players(full_name);
CREATE INDEX IF NOT EXISTS idx_practices_date ON practices(date);
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX IF NOT EXISTS idx_practice_attendance_practice_id ON practice_attendance(practice_id);
CREATE INDEX IF NOT EXISTS idx_practice_attendance_player_id ON practice_attendance(player_id);
CREATE INDEX IF NOT EXISTS idx_match_participation_match_id ON match_participation(match_id);
CREATE INDEX IF NOT EXISTS idx_match_participation_player_id ON match_participation(player_id);