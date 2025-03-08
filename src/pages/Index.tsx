
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Étudiants Total",
    value: "234",
    icon: Users,
    description: "12 nouveaux ce mois",
    url: "/students"
  },
  {
    title: "Enseignants",
    value: "15",
    icon: GraduationCap,
    description: "2 en congé",
    url: "/teachers"
  },
  {
    title: "Cours Actifs",
    value: "28",
    icon: BookOpen,
    description: "4 en cours",
    url: "/courses"
  },
  {
    title: "Paiements en attente",
    value: "8",
    icon: CreditCard,
    description: "3 en retard",
    url: "/payments"
  },
];

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-8 animate-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground">Bienvenue sur ScholarKeeper</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Link key={stat.title} to={stat.url}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Dernières actions effectuées</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">En construction...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cours du jour</CardTitle>
                  <CardDescription>Planning des cours d'aujourd'hui</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">En construction...</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Messages importants</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">En construction...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
