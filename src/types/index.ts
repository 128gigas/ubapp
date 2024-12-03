export interface Player {
  id: string;
  profilePhoto: string;
  fullName: string;
  dateOfBirth: string;
  healthCardExpiration: string;
  goalsScored: number;
  goalsAgainst: number;
  position?: string;
}

export interface Practice {
  id: string;
  date: string;
  attendees: string[];
  absentees: string[];
  notes?: string;
}

export interface Match {
  id: string;
  date: string;
  rival: string;
  result: {
    homeScore: number;
    awayScore: number;
  };
  players: {
    playerId: string;
    minutesPlayed: number;
    substitutionTime?: number;
    position?: string;
  }[];
  absentees: string[];
  venue: string;
  coach: string;
}

export interface PlayerStatistics {
  totalMatches: number;
  matchesPlayed: number;
  matchesAbsent: number;
  totalPractices: number;
  practicesAttended: number;
  practicesAbsent: number;
  attendanceRate: number;
  averageMinutesPlayed: number;
  totalGoalsScored: number;
  totalGoalsAgainst: number;
}

// Database interfaces
export interface DbPlayer {
  id: string;
  profile_photo: string;
  full_name: string;
  date_of_birth: string;
  health_card_expiration: string;
  goals_scored: number;
  goals_against: number;
  position?: string;
  created_at: string;
}

export interface DbPractice {
  id: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface DbPracticeAttendance {
  id: string;
  practice_id: string;
  player_id: string;
  status: 'present' | 'absent';
  created_at: string;
}

export interface DbMatch {
  id: string;
  date: string;
  rival: string;
  home_score: number;
  away_score: number;
  venue: string;
  coach: string;
  created_at: string;
}

export interface DbMatchParticipation {
  id: string;
  match_id: string;
  player_id: string;
  minutes_played: number;
  substitution_time?: number;
  position?: string;
  status: 'played' | 'absent';
  created_at: string;
}