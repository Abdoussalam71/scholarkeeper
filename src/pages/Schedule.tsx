
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { ScheduleView } from "@/components/schedule/ScheduleView";

const SchedulePage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Planning des Cours</h1>
              <p className="text-muted-foreground">Consultez et gérez les horaires des cours</p>
            </div>
            <ScheduleView />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SchedulePage;
