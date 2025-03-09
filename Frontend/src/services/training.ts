
import { supabase } from "@/integrations/supabase/client";
import type { TrainingModule, ModuleProgress, TrainingSession } from "@/types/training";

export const trainingService = {
  // Fetch available training modules
  getModules: async (): Promise<TrainingModule[]> => {
    const { data, error } = await supabase
      .from('training_modules')
      .select('*')
      .order('order_index');

    if (error) throw error;
    return (data || []) as TrainingModule[];
  },

  // Start a new training session
  startSession: async (): Promise<TrainingSession> => {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([{ 
        progress: 0,
        status: 'in_progress' as const
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');
    
    // Use type assertion to safely convert the status field
    return {
      ...data,
      status: data.status as 'in_progress' | 'completed' | 'paused'
    } as TrainingSession;
  },

  // Update module progress
  updateModuleProgress: async (
    moduleId: string,
    sessionId: string,
    progress: number,
    status: ModuleProgress['status']
  ): Promise<ModuleProgress> => {
    const { data, error } = await supabase
      .from('module_progress')
      .upsert({
        module_id: moduleId,
        session_id: sessionId,
        progress,
        status,
        last_activity_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from upsert');
    
    // Use type assertion to safely convert the status field
    return {
      ...data,
      status: data.status as 'not_started' | 'in_progress' | 'completed'
    } as ModuleProgress;
  },

  // Get progress for all modules in a session
  getSessionProgress: async (sessionId: string): Promise<ModuleProgress[]> => {
    const { data, error } = await supabase
      .from('module_progress')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;
    
    // Use map to ensure each item has the correct status type
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'not_started' | 'in_progress' | 'completed'
    })) as ModuleProgress[];
  },

  // Complete a training session
  completeSession: async (sessionId: string): Promise<TrainingSession> => {
    const { data, error } = await supabase
      .from('training_sessions')
      .update({ 
        status: 'completed' as const,
        completed_at: new Date().toISOString(),
        progress: 100
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');
    
    // Use type assertion to safely convert the status field
    return {
      ...data,
      status: data.status as 'in_progress' | 'completed' | 'paused'
    } as TrainingSession;
  }
};
