
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { StudentsList } from "@/components/students/StudentsList";
import { StudentDialog } from "@/components/students/StudentDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useStudentsData } from "@/hooks/useStudentsData";
import { StudentData } from "@/types/students";

const StudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { students, isLoading, addStudent, updateStudent, deleteStudent } = useStudentsData(searchQuery);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const handleAddStudent = (student: Omit<StudentData, "id">) => {
    addStudent(student);
  };

  const handleEditStudent = (student: StudentData) => {
    setSelectedStudent(student);
    setEditDialogOpen(true);
  };

  const handleUpdateStudent = (student: Omit<StudentData, "id">) => {
    if (selectedStudent) {
      updateStudent(selectedStudent.id, student);
    }
  };

  const handleDeleteDialogOpen = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteStudent = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
    }
  };

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
              <Button 
                className="flex items-center gap-2"
                onClick={() => setAddDialogOpen(true)}
              >
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
                {isLoading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : (
                  <StudentsList 
                    students={students} 
                    onEdit={handleEditStudent}
                    onDelete={handleDeleteDialogOpen}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dialogs */}
          <StudentDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onSave={handleAddStudent}
            title="Ajouter un étudiant"
          />

          {selectedStudent && (
            <StudentDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              student={selectedStudent}
              onSave={handleUpdateStudent}
              title="Modifier l'étudiant"
            />
          )}

          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteStudent}
            title="Supprimer l'étudiant"
            description={`Êtes-vous sûr de vouloir supprimer l'étudiant "${selectedStudent?.name}" ? Cette action est irréversible.`}
            confirmLabel="Supprimer"
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentsPage;
