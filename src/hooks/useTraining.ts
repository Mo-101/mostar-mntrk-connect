
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trainingService } from "@/services/training";
import { toast } from "sonner";

export const useTraining = () => {
  const queryClient = useQueryClient();

  const modules = useQuery({
    queryKey: ['training-modules'],
    queryFn: trainingService.getModules,
  });

  const startSession = useMutation({
    mutationFn: trainingService.startSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast.success('Training session started');
    },
    onError: (error) => {
      console.error('Error starting training session:', error);
      toast.error('Failed to start training session');
    },
  });

  const updateProgress = useMutation({
    mutationFn: ({ moduleId, sessionId, progress, status }: { 
      moduleId: string; 
      sessionId: string; 
      progress: number; 
      status: 'not_started' | 'in_progress' | 'completed' 
    }) => trainingService.updateModuleProgress(moduleId, sessionId, progress, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      toast.success('Progress updated');
    },
    onError: (error) => {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    },
  });

  const completeSession = useMutation({
    mutationFn: trainingService.completeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-sessions'] });
      toast.success('Training session completed');
    },
    onError: (error) => {
      console.error('Error completing training session:', error);
      toast.error('Failed to complete training session');
    },
  });

  return {
    modules,
    startSession,
    updateProgress,
    completeSession,
  };
};
