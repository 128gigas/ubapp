import { supabase } from '../lib/supabase';
import { Practice } from '../types';

export const practiceService = {
  async getAll(): Promise<Practice[]> {
    // First get all practices
    const { data: practices, error: practicesError } = await supabase
      .from('practices')
      .select('*')
      .order('date', { ascending: false });
    
    if (practicesError) {
      console.error('Error fetching practices:', practicesError);
      return [];
    }

    // Then get attendance for each practice
    const practicesWithAttendance = await Promise.all(
      (practices || []).map(async (practice) => {
        // Get attendees
        const { data: attendees } = await supabase
          .from('practice_attendance')
          .select('player_id')
          .eq('practice_id', practice.id)
          .eq('status', 'present');

        // Get absentees
        const { data: absentees } = await supabase
          .from('practice_attendance')
          .select('player_id')
          .eq('practice_id', practice.id)
          .eq('status', 'absent');

        return {
          id: practice.id,
          date: practice.date,
          notes: practice.notes,
          attendees: attendees?.map(a => a.player_id) || [],
          absentees: absentees?.map(a => a.player_id) || [],
        };
      })
    );

    return practicesWithAttendance;
  },

  async create(practice: Omit<Practice, 'id'>) {
    // First create the practice
    const { data: newPractice, error: practiceError } = await supabase
      .from('practices')
      .insert({ 
        date: practice.date,
        notes: practice.notes 
      })
      .select()
      .single();

    if (practiceError || !newPractice) {
      return { error: practiceError };
    }

    // Create attendance records for attendees
    if (practice.attendees.length > 0) {
      const attendeeRecords = practice.attendees.map(playerId => ({
        practice_id: newPractice.id,
        player_id: playerId,
        status: 'present' as const,
      }));

      const { error: attendeeError } = await supabase
        .from('practice_attendance')
        .insert(attendeeRecords);

      if (attendeeError) {
        return { error: attendeeError };
      }
    }

    // Create attendance records for absentees
    if (practice.absentees.length > 0) {
      const absenteeRecords = practice.absentees.map(playerId => ({
        practice_id: newPractice.id,
        player_id: playerId,
        status: 'absent' as const,
      }));

      const { error: absenteeError } = await supabase
        .from('practice_attendance')
        .insert(absenteeRecords);

      if (absenteeError) {
        return { error: absenteeError };
      }
    }

    return { error: null };
  },

  async update(id: string, practice: Omit<Practice, 'id'>) {
    // Update practice details
    const { error: practiceError } = await supabase
      .from('practices')
      .update({ 
        date: practice.date,
        notes: practice.notes 
      })
      .eq('id', id);

    if (practiceError) {
      return { error: practiceError };
    }

    // Delete existing attendance records
    const { error: deleteError } = await supabase
      .from('practice_attendance')
      .delete()
      .eq('practice_id', id);

    if (deleteError) {
      return { error: deleteError };
    }

    // Create new attendance records for attendees
    if (practice.attendees.length > 0) {
      const attendeeRecords = practice.attendees.map(playerId => ({
        practice_id: id,
        player_id: playerId,
        status: 'present' as const,
      }));

      const { error: attendeeError } = await supabase
        .from('practice_attendance')
        .insert(attendeeRecords);

      if (attendeeError) {
        return { error: attendeeError };
      }
    }

    // Create new attendance records for absentees
    if (practice.absentees.length > 0) {
      const absenteeRecords = practice.absentees.map(playerId => ({
        practice_id: id,
        player_id: playerId,
        status: 'absent' as const,
      }));

      const { error: absenteeError } = await supabase
        .from('practice_attendance')
        .insert(absenteeRecords);

      if (absenteeError) {
        return { error: absenteeError };
      }
    }

    return { error: null };
  },

  async delete(id: string) {
    // The practice_attendance records will be automatically deleted due to ON DELETE CASCADE
    const { error } = await supabase
      .from('practices')
      .delete()
      .eq('id', id);
    return { error };
  }
};