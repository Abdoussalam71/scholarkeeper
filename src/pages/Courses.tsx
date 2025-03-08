
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { CoursesList } from "@/components/courses/CoursesList";

const CoursesPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-6 animate-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gestion des Cours</h1>
              <p className="text-muted-foreground">Gérez les cours et leurs horaires</p>
            </div>
            
            <CoursesList />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CoursesPage;
