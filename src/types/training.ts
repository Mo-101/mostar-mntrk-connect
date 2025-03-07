
export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration?: number;
  order_index: number;
  prerequisites: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  session_id: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  last_activity_at?: string;
}

export interface TrainingSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  current_module?: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'paused';
}
