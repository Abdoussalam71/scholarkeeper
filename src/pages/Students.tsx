
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { StudentsList } from "@/components/students/StudentsList";
import { StudentData } from "@/types/students";

// Sample student data for now, later to be replaced with API calls
const initialStudents: StudentData[] = [
  { id: "1", name: "Antoine Dupont", age: 16, class: "Seconde B", email: "antoine@example.com", attendance: 92 },
  { id: "2", name: "Emma Martin", age: 17, class: "Première A", email: "emma@example.com", attendance: 88 },
  { id: "3", name: "Lucas Bernard", age: 15, class: "Troisième C", email: "lucas@example.com", attendance: 95 },
  { id: "4", name: "Léa Petit", age: 18, class: "Terminale S", email: "lea@example.com", attendance: 98 },
  { id: "5", name: "Thomas Dubois", age: 16, class: "Seconde A", email: "thomas@example.com", attendance: 85 },
];

const StudentsPage = () => {
  const [students, setStudents] = useState<StudentData[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h1 className="text-3xl font-bold tracking-tight">Étudiants</h1>
                <p className="text-muted-foreground">Gérez tous vos étudiants</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> 
                Ajouter un étudiant
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Liste des étudiants</CardTitle>
                <div className="relative mt-2 w-full md:w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un étudiant..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <StudentsList students={filteredStudents} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentsPage;
