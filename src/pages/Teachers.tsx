
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { TeachersList } from "@/components/teachers/TeachersList";
import { TeacherData } from "@/types/teachers";

// Données d'exemple des enseignants
const initialTeachers: TeacherData[] = [
  { id: "1", name: "Marie Dubois", subject: "Mathématiques", email: "marie.dubois@example.com", phone: "06 12 34 56 78", availability: "Lundi, Mardi, Jeudi", hireDate: "01/09/2019" },
  { id: "2", name: "Pierre Martin", subject: "Physique-Chimie", email: "pierre.martin@example.com", phone: "06 23 45 67 89", availability: "Mardi, Mercredi, Vendredi", hireDate: "15/09/2020" },
  { id: "3", name: "Sophie Laurent", subject: "Français", email: "sophie.laurent@example.com", phone: "06 34 56 78 90", availability: "Lundi, Jeudi, Vendredi", hireDate: "01/09/2018" },
  { id: "4", name: "Jean Lefebvre", subject: "Histoire-Géographie", email: "jean.lefebvre@example.com", phone: "06 45 67 89 01", availability: "Mercredi, Jeudi, Vendredi", hireDate: "01/09/2021" },
  { id: "5", name: "Camille Bernard", subject: "Anglais", email: "camille.bernard@example.com", phone: "06 56 78 90 12", availability: "Lundi, Mardi, Mercredi", hireDate: "01/09/2017" },
];

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<TeacherData[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <SidebarTrigger />
          <div className="space-y-6 animate-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Enseignants</h1>
                <p className="text-muted-foreground">Gérez l'équipe enseignante</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> 
                Ajouter un enseignant
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Liste des enseignants</CardTitle>
                <div className="relative mt-2 w-full md:w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un enseignant..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <TeachersList teachers={filteredTeachers} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeachersPage;
