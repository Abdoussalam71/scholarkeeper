
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleService } from "@/services/database";
import { ScheduleEvent } from "@/types/schedule";
import { toast } from "sonner";

export function useScheduleData(classId?: string) {
  const queryClient = useQueryClient();
  
  // Initialize the database on first load
  useQuery({
    queryKey: ["schedulesInit"],
    queryFn: async () => {
      await scheduleService.initSchedules();
      return true;
    },
    staleTime: Infinity
  });
  
  // Get schedule data
  const { data: schedules = [], isLoading, error } = useQuery({
    queryKey: ["schedules", classId],
    queryFn: async () => {
      if (classId) {
        return scheduleService.getScheduleByClassId(classId);
      }
      return scheduleService.getAllSchedules();
    }
  });
  
  // Add a new schedule event
  const addScheduleMutation = useMutation({
    mutationFn: (newSchedule: Omit<ScheduleEvent, "id">) => 
      scheduleService.addSchedule(newSchedule),
    onSuccess: () => {
      toast.success("Cours ajouté à l'emploi du temps");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du cours");
    }
  });
  
  // Update an existing schedule event
  const updateScheduleMutation = useMutation({
    mutationFn: (schedule: ScheduleEvent) => 
      scheduleService.updateSchedule(schedule),
    onSuccess: () => {
      toast.success("Emploi du temps mis à jour");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    }
  });
  
  // Delete a schedule event
  const deleteScheduleMutation = useMutation({
    mutationFn: (id: string) => 
      scheduleService.deleteSchedule(id),
    onSuccess: () => {
      toast.success("Cours supprimé de l'emploi du temps");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    }
  });
  
  return {
    schedules,
    isLoading,
    error,
    addSchedule: (schedule: Omit<ScheduleEvent, "id">) => addScheduleMutation.mutate(schedule),
    updateSchedule: (schedule: ScheduleEvent) => updateScheduleMutation.mutate(schedule),
    deleteSchedule: (id: string) => deleteScheduleMutation.mutate(id)
  };
}
