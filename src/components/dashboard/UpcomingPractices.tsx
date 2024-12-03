import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Practice } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface PracticeWithAttendance extends Practice {
  attendeeCount: number;
}

export default function UpcomingPractices() {
  const [practices, setPractices] = useState<PracticeWithAttendance[]>([]);

  useEffect(() => {
    fetchUpcomingPractices();
  }, []);

  const fetchUpcomingPractices = async () => {
    const today = new Date().toISOString();
    
    // First get the practices
    const { data: practicesData, error: practicesError } = await supabase
      .from('practices')
      .select('*')
      .gte('date', today)
      .order('date')
      .limit(5);

    if (practicesError) {
      console.error('Error fetching practices:', practicesError);
      return;
    }

    // Then get the attendance counts for each practice
    const practicesWithAttendance = await Promise.all(
      (practicesData || []).map(async (practice) => {
        const { count } = await supabase
          .from('practice_attendance')
          .select('*', { count: 'exact', head: true })
          .eq('practice_id', practice.id)
          .eq('status', 'present');

        return {
          ...practice,
          attendees: [],  // We'll only use the count for the dashboard
          absentees: [],  // We'll only use the count for the dashboard
          attendeeCount: count || 0,
        };
      })
    );

    setPractices(practicesWithAttendance);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Practices
      </h2>
      <div className="space-y-4">
        {practices.map((practice) => (
          <div
            key={practice.id}
            className="flex items-center justify-between border-b pb-4 last:border-0"
          >
            <div>
              <p className="font-medium text-gray-900">Practice Session</p>
              <p className="text-sm text-gray-500">{formatDate(practice.date)}</p>
            </div>
            <div className="text-sm text-gray-500">
              {practice.attendeeCount} players attending
            </div>
          </div>
        ))}
        {practices.length === 0 && (
          <p className="text-gray-500 text-center py-4">No upcoming practices scheduled</p>
        )}
      </div>
    </div>
  );
}