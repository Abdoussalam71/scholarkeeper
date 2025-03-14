
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { ScheduleView } from "@/components/schedule/ScheduleView";
import { useScheduleData } from "@/hooks/useScheduleData";
import { useClassesData } from "@/hooks/useClassesData";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/database";

const SchedulePage = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);
  const { classes } = useClassesData();
  const { schedules, isLoading, addSchedule, updateSchedule, deleteSchedule } = useScheduleData(selectedClassId);
  
  // Récupérer les cours pour le sélecteur
  const { data: courses = [] } = useQuery({
    queryKey: ["coursesForSchedule"],
    queryFn: () => courseService.getAllCourses()
  });
  
  // Préparer les données des cours pour le composant
  const coursesData = courses.map(course => ({
    id: course.id,
    name: course.name,
    teacherName: course.teacherName
  }));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Planning des Cours</h1>
              <p className="text-muted-foreground">Consultez et gérez les horaires des cours par classe</p>
            </div>
            <ScheduleView 
              schedules={schedules}
              classes={classes}
              courses={coursesData}
              isLoading={isLoading}
              selectedClassId={selectedClassId}
              onClassChange={setSelectedClassId}
              onAddSchedule={addSchedule}
              onUpdateSchedule={updateSchedule}
              onDeleteSchedule={deleteSchedule}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchedulePage;
