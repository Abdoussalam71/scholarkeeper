
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { EvaluationsView } from "@/components/evaluations/EvaluationsView";
import { useEvaluationsData } from "@/hooks/useEvaluationsData";
import { useClassesData } from "@/hooks/useClassesData";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/database";

const EvaluationsPage = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const { classes } = useClassesData();
  const { evaluations, isLoading, addEvaluation, updateEvaluation, deleteEvaluation } = useEvaluationsData(selectedClassId || undefined);
  
  // Récupérer les cours pour le sélecteur
  const { data: courses = [] } = useQuery({
    queryKey: ["coursesForEvaluation"],
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
              <h1 className="text-3xl font-bold tracking-tight">Évaluations</h1>
              <p className="text-muted-foreground">Planifiez et gérez les évaluations pour les différentes classes</p>
            </div>
            <EvaluationsView
              evaluations={evaluations}
              classes={classes}
              courses={coursesData}
              isLoading={isLoading}
              selectedClassId={selectedClassId || undefined}
              onClassChange={setSelectedClassId}
              onAddEvaluation={addEvaluation}
              onUpdateEvaluation={updateEvaluation}
              onDeleteEvaluation={deleteEvaluation}
            />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EvaluationsPage;
