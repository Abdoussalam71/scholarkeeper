
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { TeachersList } from "@/components/teachers/TeachersList";
import { TeacherDialog } from "@/components/teachers/TeacherDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTeachersData } from "@/hooks/useTeachersData";
import { TeacherData } from "@/types/teachers";
import { useNavigate } from "react-router-dom";

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { teachers, isLoading, addTeacher, updateTeacher, deleteTeacher } = useTeachersData(searchQuery);
  const navigate = useNavigate();
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherData | null>(null);

  const handleAddTeacher = (teacher: Omit<TeacherData, "id">) => {
    addTeacher(teacher);
  };

  const handleEditTeacher = (teacher: TeacherData) => {
    setSelectedTeacher(teacher);
    setEditDialogOpen(true);
  };

  const handleUpdateTeacher = (teacher: Omit<TeacherData, "id">) => {
    if (selectedTeacher) {
      updateTeacher(selectedTeacher.id, teacher);
    }
  };

  const handleDeleteDialogOpen = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setSelectedTeacher(teacher);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteTeacher = () => {
    if (selectedTeacher) {
      deleteTeacher(selectedTeacher.id);
    }
  };

  const handleViewSchedule = (teacherId: string) => {
    navigate(`/schedule?teacherId=${teacherId}`);
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
                <h1 className="text-3xl font-bold tracking-tight">Enseignants</h1>
                <p className="text-muted-foreground">Gérez l'équipe enseignante</p>
              </div>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setAddDialogOpen(true)}
              >
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
                {isLoading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : (
                  <TeachersList 
                    teachers={teachers} 
                    onEdit={handleEditTeacher}
                    onDelete={handleDeleteDialogOpen}
                    onViewSchedule={handleViewSchedule}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Dialogs */}
          <TeacherDialog
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onSave={handleAddTeacher}
            title="Ajouter un enseignant"
          />

          {selectedTeacher && (
            <TeacherDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              teacher={selectedTeacher}
              onSave={handleUpdateTeacher}
              title="Modifier l'enseignant"
            />
          )}

          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteTeacher}
            title="Supprimer l'enseignant"
            description={`Êtes-vous sûr de vouloir supprimer l'enseignant "${selectedTeacher?.name}" ? Cette action est irréversible.`}
            confirmLabel="Supprimer"
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeachersPage;
